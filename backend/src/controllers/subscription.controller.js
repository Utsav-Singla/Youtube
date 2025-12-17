import mongoose from 'mongoose';
import Subscription from '../models/subscription.models.js';
import User from '../models/user.models.js';

/**
 * @desc    Subscribe / Unsubscribe to a channel
 * @route   POST /api/subscriptions/:channelId
 * @access  Private
 */
const toggleSubscription = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;

    // 🔴 Validate ID
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid channel ID',
      });
    }

    // 🔴 Prevent self-subscription
    if (channelId === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot subscribe to yourself',
      });
    }

    // 🔴 Ensure channel exists
    const channelExists = await User.exists({ _id: channelId });
    if (!channelExists) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found',
      });
    }

    const existingSub = await Subscription.findOne({
      subscriber: userId,
      channel: channelId,
    });

    // 🔁 Toggle logic
    if (existingSub) {
      await existingSub.deleteOne();
      return res.status(200).json({
        success: true,
        message: 'Unsubscribed successfully',
      });
    }

    await Subscription.create({
      subscriber: userId,
      channel: channelId,
    });

    return res.status(201).json({
      success: true,
      message: 'Subscribed successfully',
    });
  } catch (error) {
    console.error('SUBSCRIPTION ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Subscription failed',
    });
  }
};

/**
 * @desc    Get SubscribeCount of a channel
 * @route   POST /api/subscriptions/:userid/stats
 * @access  Private
 */

const getChannelStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const subscribers = await Subscription.countDocuments({
      channel: userId,
    });

    let isSubscribed = false;

    if (req.user) {
      isSubscribed = !!(await Subscription.exists({
        channel: userId,
        subscriber: req.user._id,
      }));
    }

    return res.status(200).json({
      success: true,
      subscribers,
      isSubscribed,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch channel stats',
    });
  }
};
export { toggleSubscription, getChannelStats };
