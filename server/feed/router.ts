import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import FeedCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as freetTypeValidator from '../freetType/middleware';
import * as feedValidator from '../feed/middleware';
import * as util from './util';
import * as freetTypeUtil from '../freetType/util';
import FeedModel from './model';
import FreetTypeModel from '../freetType/model';
import FreetModel from '../freet/model';
import * as freetUtil from '../freet/util';

const router = express.Router();

/**
 * Create a new feed.
 *
 * @name POST /api/feeds
 *
 * @param {string} politics - Politics preference
 * @param {string} comedy - Comedy preference
 * @param {string} sports - Sports preference
 * @param {string} engineering - Engineering preference
 * @param {string} happy - Happy preference
 * @param {string} sad - Sad preference
 * @return {FeedResponse} - The created feed
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the user inputs don't match 'Yes' or 'No'
 * @throws {409} - If the user has already created a feed
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    feedValidator.isFirstFeed,
    feedValidator.isValidInputs
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const feed = await FeedCollection.addOne(userId, req.body.politics, req.body.comedy, req.body.sports, req.body.engineering, req.body.happy, req.body.sad);

    res.status(201).json({
      message: 'Your feed was created successfully.',
      feed: util.constructFeedResponse(feed)
    });
  }
);

/**
 * Update Feed
 *
 * @name PATCH /api/feeds
 *
 * @param {string} politics - Politics preference
 * @param {string} comedy - Comedy preference
 * @param {string} sports - Sports preference
 * @param {string} engineering - Engineering preference
 * @param {string} happy - Happy preference
 * @param {string} sad - Sad preference
 * @return {FullStoryResponse} - the updated feed
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the user inputs don't match 'Yes' or 'No'
 * @throws {409} - If the user has not already created a feed
 */
router.patch(
  '/',
  [
    userValidator.isUserLoggedIn,
    feedValidator.isNotFirstFeed,
    feedValidator.isValidInputs
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const feed = await FeedCollection.updateOne(userId, req.body.politics, req.body.comedy, req.body.sports, req.body.engineering, req.body.happy, req.body.sad);

    res.status(201).json({
      message: 'Your feed was updated successfully.',
      feed: util.constructFeedResponse(feed)
    });
  }
);

/**
 * Curate feed
 *
 * @name GET /api/feeds
 *
 * @return {FreetTypeResponse[]} - curated feed per user feed preferences sorted in decending order by date
 * @throws {403} - If the user is not logged in
 * @throws {409} - If the user has not already created a feed
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
    feedValidator.isNotFirstFeed
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const curated = await FeedCollection.curateFeed(userId);
    const response = curated
                            .map(freetTypeUtil.constructFreetTypeResponse)
                            .map(x => x.publishedContent._id.toString());

    const curatedFreet = await FreetModel
          .find({_id: {$in: response}})
          .sort({dateFreetType: -1})
          .populate('authorId');

    const newResponse = curatedFreet.map(freetUtil.constructFreetResponse);
    res.status(200).json(newResponse);
  }
);

/**
 * Get all the feeds
 *
 * @name GET /api/feeds/preferences
 *
 * @return {FeedResponse[]} - A list of user's feed preferences
 * @throws {403} - If the user is not logged in
 * @throws {409} - If the user has not already created a feed
 */
router.get(
  '/preferences',
  [
    userValidator.isUserLoggedIn,
    feedValidator.isNotFirstFeed
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const userFeed = await FeedCollection.findOneByUserId(userId);
    const response = util.constructFeedResponse(userFeed);
    res.status(200).json(response);
  }
);

export {router as feedRouter};

