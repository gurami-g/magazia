import mariadb from 'mariadb';
import bcrypt from 'bcrypt';

const pool = mariadb.createPool({
	host: 'localhost',
	database: 'trendyshopdb',
	user: 'root',
	password: '123',
});

const saltRounds = 10;

const createConnection = async () => await pool.getConnection();

export const loginUser = async (req, res) => {
	let conn;
	const email = req.body.email;
	const password = req.body.password;

	try {
		conn = await createConnection();

		const user = await conn.query(`SELECT * FROM users WHERE email = ?`, [email]);

		if (user.length > 0) {
			bcrypt.compare(password, user[0].password, (err, enc) => {
				if (err) {
					console.log(err);
				}
				if (enc) {
					req.session.loggedIn = true;
					res.send(req.session.loggedIn);
				} else {
					res.send('პაროლი არასწორია');
				}
			});
		} else {
			res.send('მომხმარებელი ვერ მოიძებნა');
		}
	} catch (err) {
		console.log(err);
	} finally {
		if (conn) conn.end();
	}
};

export const logOut = async (req, res) => {
	req.session.destroy();
	res.clearCookie('user');
	res.send({ loggedIn: false });
};

export const getUser = async (req, res) => {
	if (req.session.loggedIn) res.send({ loggedIn: true });
	else res.send({ loggedIn: false });
};

export const getUserData = async (req, res) => {
	if (req.session.loggedIn) {
		let conn;

		try {
			conn = await createConnection();

			const userData = await conn.query(`SELECT userId, firstName, lastName, email, dateOfBirth, phone, privateNumber FROM users WHERE userId = 2`);

			res.send(userData[0]);
		} catch (err) {
			console.log(err);
		} finally {
			if (conn) conn.end();
		}
	} else {
		res.send(false);
	}
}

export const updateUserData = async (req, res) => {
	let conn;

	const { firstName, lastName, phone, email, privateNumber, dateOfBirth } = req.body;

	try {
		conn = await createConnection();

		await conn.query(`UPDATE users SET firstName = ?, lastName = ?, email = ?, phone = ?, privateNumber = ?, dateOfBirth = ? WHERE userId = 2`,
			[firstName, lastName, email, phone, privateNumber, dateOfBirth])

		res.send("UPDATED");

	} catch (err) {
		console.log(err);
	} finally {
		if (conn) conn.end();
	}
}

export const updatePassword = async (req, res) => {
	let conn;

	const { password } = req.body;

	try {
		conn = await createConnection();

		bcrypt.hash(password, saltRounds, (err, enc) => {
			if (err) {
				res.send(false);
			}
			if (enc) {
				conn.query(`UPDATE users SET password = ? WHERE userId = 2`, [enc]);
				res.send("password updated!")
			}
		})

	} catch (err) {
		console.log(err);
	} finally {
		if (conn) conn.end();
	}
}
