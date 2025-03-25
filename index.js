import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import { initiateApp } from './src/initiate-app.js';
config();

const app = express();
app.use(cors());

initiateApp(app, express);
