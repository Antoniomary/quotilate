import { ObjectId } from 'mongodb';
import db from '../../utils/db.js';
import cache from '../../utils/redis.js';

const QUOTE_URL = 'http://zenquotes.io/api/quotes';

class QuotesController {
  static async getRandomQuote (req, res) {
    if (!db.isAlive() || !cache.isAlive()) {
      return res.status(500).json({ error: 'unable to process request' });
    }

    const save = async (quotes) => {
      for (const quote of quotes) {
        const exists = await db.db.collection('quotes').findOne({ quote: quote.q });

        if (exists) continue;

        const newQuote = {
          quote: quote.q,
          author: quote.a,
          savedAt: new Date(),
        };

        await db.db.collection('quotes').insertOne(newQuote);
      }
    }

    const fetchFromThirdParty = async () => {
      try {
        const response = await fetch(QUOTE_URL)
        if (!response.ok) throw new Error('Could not get quote');

        const quotes = await response.json();

        await save(quotes);
      } catch(err) {
        throw new Error('Could not get quote');
      }
    }

    if (await db.nbQuotes() === 0) {
      try {
        await fetchFromThirdParty();
      } catch {
        const quotes = [
          {
            q: 'Well done is better than well said.',
            a: 'Benjamin Franklin',
          },
          {
            q: 'When you make a choice, you change the future.',
            a: 'Deepak Chopra',
          }
        ];

        await save(quotes);
      }
    } else if ([1, 3].includes(Math.floor(Math.random() * 6))) {
      try {
        await fetchFromThirdParty();
      } catch {}
    }

    const quotes = (await db.db.collection('quotes').find({}).toArray());
    const choice = Math.floor(Math.random() * await db.nbQuotes());
    const quote = quotes[choice];

    return res.status(200).json({
      id: quote._id,
      quote: quote.quote,
      author: quote.author,
    });
  }

  static async getUserQuotes (req, res) {
    return res.status(200).json(req.user.quotes);
  }

  static async getOneUserQuote (req, res) {
    const quoteId = req.params.id;
    if (!quoteId) return res.status(400).json({ error: "Missing quote Id" });

    const user = req.user;

    const quote = user.quotes.filter((quote) => quote._id.toString() === quoteId);
    if (!quote) return res.status(404).json({
      error: `quote with id ${quoteId} doesn't exist`
    });

    return res.status(200).json(quote[0])
  }

  static async saveQuote (req, res) {
    let quoteId = req.params.id;
    if (!quoteId) return res.status(400).json({ error: "Missing quote Id" });
    const user = req.user;
    
    if (!db.isAlive()) {
      return res.status(500).json({ error: 'unable to process request' });
    }

    if (user.quotes.some((quote) => quote._id.toString() === quoteId)) {
      return res.status(200).json({ message: `quote with id ${quoteId} already saved` });
    }

    try {
      const quote = await db.db.collection('quotes').findOne({
        _id: new ObjectId(quoteId),
      });
      if (!quote) return res.status(404).json({
        error: `quote with id ${quoteId} doesn't exist`,
      });
    } catch {
      return res.status(400).json({ error: 'Invalid Quote Id' });
    }

    try {
      quote.savedAt = new Date();
      await db.db.collection('users').updateOne({ _id: user._id }, {
        $push: {
          quotes: quote,
        },
        $inc : {
          numberOfQuotes: 1,
        }
      });
    } catch {
      return res.status(500).json({ error: 'unable to process request' });
    }

    return res.status(201).json({
      id: quote._id,
      quote: quote.quote,
      author: quote.author,
      savedAt: quote.savedAt,
    });
  }

  static async deleteQuote (req, res) {
    let quoteId = req.params.id;
    if (!quoteId) return res.status(400).json({ error: "Missing quote Id" });
    const user = req.user;

    if (!db.isAlive()) {
      return res.status(500).json({ error: 'unable to process request' });
    }

    let quoteExists = false;
    let index = 0;
    const newQuoteList = user.quotes;
    for (const quote of user.quotes) {
      if (quote._id.toString() === quoteId) {
        quoteExists = true;
        newQuoteList[index];
        user.numberOfQuotes -= 1;
        break;
      }
      index++;
    };

    if (!quoteExists) return res.status(404).json({
      error: `quote with id ${quoteId} not saved`
    });
  
    const userId = req.user._id;
    try {
      await db.db.collection('users').updateOne({ _id: userId }, {
        $pull: {
          quotes: { _id: new ObjectId(quoteId) },
        },
        $inc: {
          numberOfQuotes: -1,
        }
      });
    } catch {
      return res.status(500).json({ error: 'unable to process request' });
    }

    return res.status(204).json({});
  }
}

export default QuotesController;
