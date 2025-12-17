import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import videoRoutes from './routes/video.routes.js';
import likeRoutes from './routes/like.routes.js';
import commentRoutes from './routes/comment.routes.js';
import channelRoutes from './routes/channel.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/subscriptions', subscriptionRoutes);


export default app;
