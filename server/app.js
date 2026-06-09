import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import ProductRouter from './routes/ProductRoutes.js';
import UserRoutes from './routes/UserRoutes.js';

const app = express();
const port = process.env.PORT | 5000;

app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

app.use(
	session({
		key: 'user',
		secret: 'trendyshop$ecret',
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: new Date().getTime(),
			expires: new Date().getTime(),
			httpOnly: true,
		},
	}),
);

app.use(
	cors({
		origin: ['http://192.168.1.105:3000'],
		methods: ['GET', 'POST', 'DELETE', 'PUT'],
		credentials: true,
	}),
);

app.use('/images', express.static('images'));
app.get('/', (req, res) => res.send('Hello World!'));

app.use(ProductRouter);
app.use(UserRoutes);

app.listen(port, console.log('server is running on port:', port));
