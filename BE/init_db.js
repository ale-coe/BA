const localDbName = 'localDb.db';

const { hashSync } = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { readdirSync } = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: ['.env_util', '.env'] });

const generateUser = () => {
  const path = process.env.INIT_DB_PROFILE_IMAGES_PATH;
  const files = readdirSync(path);
  const specialFile = '826c95d1-938f-49ec-b315-060d5346feac.webp';
  const data = [];

  // id starts at 1 in db, therefore start here at 1, too
  for (let i = 1; i <= files.length; i++) {
    const file = files[i - 1];
    if (file === specialFile) {
      data.push({
        email: process.env.BACKUP_EMAIL,
        password: hashSync(process.env.PASSWORD, 10),
        activationCode: uuidv4(),
        activated: 1,
        userRole: 'ADMIN',
        source: 'EMAIL',
        profileImage: file,
        showPosition: 0,
        username: `Nutzer-${i}`,
        position: null,
      });
      continue;
    }

    data.push({
      email: `test${i}@mail.de`,
      password: hashSync(process.env.PASSWORD, 10),
      activationCode: uuidv4(),
      activated: 1,
      userRole: 'USER',
      source: 'EMAIL',
      profileImage: file,
      showPosition: i === 22 || i === 6 ? 1 : 0,
      username: `Nutzer-${i}`,
      position:
        i === 22
          ? '[54.3158711483319, 10.086836636226089]'
          : i === 6
            ? '[54.34041988990282, 10.154994771512634]'
            : null,
    });
  }

  return data;
};

const generateProducts = () => {
  const path = process.env.INIT_DB_PRODUCT_IMAGES_PATH;
  const files = readdirSync(path);
  const data = [];

  // id starts at 1 in db, therefore start here at 1, too
  for (let i = 1; i <= files.length; i++) {
    const file = files[i - 1];

    data.push({
      name: `Gutschein ${i}`,
      imagePath: file,
      price: i,
      hidden: 0,
    });
  }

  return data;
};

const generateRaffles = () => {
  const data = [];

  for (let i = 1; i <= 2; i++) {
    data.push({
      productId: i,
      stopped: 0,
      description: `Verlosung ${i}`,
      startDate: Date.now() - i * 1000 * 60 * 60 * 24 * 7,
      endDate: Date.now() + i * 1000 * 60 * 60 * 24 * 7,
    });
  }

  return data;
};

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(localDbName);

const createStatements = [
  'CREATE TABLE POSITIONSHARING (positionSharingId INTEGER PRIMARY KEY AUTOINCREMENT, sharedByUserId INTEGER NOT NULL, sharedForUserId INTEGER NOT NULL, UNIQUE(sharedByUserId, sharedForUserId));',
  'CREATE TABLE PRODUCTS (productId INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR NOT NULL, imagePath VARCHAR NOT NULL, price INTEGER NOT NULL, hidden INTEGER DEFAULT 0 NOT NULL );',
  "CREATE TABLE USERS (userId INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR UNIQUE NOT NULL, username VARCHAR, password VARCHAR, activationcode VARCHAR, activated INTEGER DEFAULT 0 NOT NULL, userRole VARCHAR CHECK(userRole IN ('ADMIN', 'USER')) DEFAULT 'USER', source VARCHAR CHECK(source IN ('GOOGLE', 'EMAIL')), city VARCHAR, profileImage VARCHAR, disabled INTEGER DEFAULT 0 NOT NULL, connectedTwitterAccount VARCHAR, position VARCHAR, showPosition INTEGER DEFAULT 0 NOT NULL, notificationId VARCHAR DEFAULT NULL, placementPoints INTEGER DEFAULT NULL, placement INTEGER DEFAULT NULL);",
  'CREATE TABLE BOUGHTPRODUCTS (boughtProductId INTEGER PRIMARY KEY AUTOINCREMENT, productId INTEGER NOT NULL, userId INTEGER NOT NULL, date INTEGER, FOREIGN KEY(userId) REFERENCES USERS(userId), FOREIGN KEY(productId) REFERENCES PRODUCTS(productId));',
  'CREATE TABLE RAFFLES (raffleId INTEGER PRIMARY KEY AUTOINCREMENT, productId INTEGER NOT NULL, stopped INTEGER NOT NULL, description VARCHAR, startDate INTEGER NOT NULL, endDate INTEGER NOT NULL, FOREIGN KEY(productId) REFERENCES PRODUCTS(productId));',
  'CREATE TABLE FEEDBACKTYPES (feedbackTypeId INTEGER PRIMARY KEY AUTOINCREMENT, label VARCHAR);',
  'CREATE TABLE FEEDBACKCATEGORIES (feedbackCategoryId INTEGER PRIMARY KEY AUTOINCREMENT, label VARCHAR);',
  'CREATE TABLE FEEDBACK (feedbackId INTEGER PRIMARY KEY AUTOINCREMENT, feedbackTypeId INTEGER NOT NULL, text VARCHAR, userId INTEGER NOT NULL, feedbackCategoryId INTEGER, date INTEGER, FOREIGN KEY(userId) REFERENCES USERS(userId), FOREIGN KEY(feedbackTypeId) REFERENCES FEEDBACKTYPES(feedbackTypeId), FOREIGN KEY(feedbackCategoryId) REFERENCES FEEDBACKCATEGORIES(feedbackCategoryId));',
  'CREATE TABLE SOCIALMEDIAPOSTS (socialMediaPostId INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, postDate INTEGER, postId VARCHAR, postContent VARCHAR, FOREIGN KEY(userId) REFERENCES USERS(userId));',
  'CREATE TABLE INVITATIONS (invitationId INTEGER PRIMARY KEY AUTOINCREMENT, invitationCode VARCHAR, userId INTEGER NOT NULL, invitationSuccessful INTEGER DEFAULT 0 NOT NULL, invitationDate INTEGER, FOREIGN KEY(userId) REFERENCES USERS(userId));',
  'CREATE TABLE CATEGORIES (categoryId INTEGER PRIMARY KEY AUTOINCREMENT, label VARCHAR, points INTEGER NOT NULL);',
  'CREATE TABLE AMOUNTS (amountId INTEGER PRIMARY KEY AUTOINCREMENT, label VARCHAR, points INTEGER NOT NULL);',
  'CREATE TABLE IMAGES (imageId INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, categoryId INTEGER, amountId INTEGER, uploadDate INTEGER NOT NULL, name VARCHAR NOT NULL, hidden INTEGER DEFAULT 0 NOT NULL, FOREIGN KEY(categoryId) REFERENCES CATEGORIES(categoryId), FOREIGN KEY(amountId) REFERENCES AMOUNTS(amountId), FOREIGN KEY(userId) REFERENCES USERS(userId));',
  'CREATE TABLE LANDMARKTYPES (landmarkTypeId INTEGER PRIMARY KEY AUTOINCREMENT, label VARCHAR, isEvent INTEGER NOT NULL);',
  'CREATE TABLE LANDMARKS (landmarkId INTEGER PRIMARY KEY AUTOINCREMENT, landmarkTypeId INTEGER NOT NULL, name VARCHAR, position VARCHAR, showFrom INTEGER, showUntil INTEGER, additionalInfo VARCHAR, FOREIGN KEY(landmarkTypeId) REFERENCES LANDMARKTYPES(landmarkTypeId));',
];

const dummyData = {
  USERS: generateUser(),
  PRODUCTS: generateProducts(),
  RAFFLES: generateRaffles(),
  FEEDBACKTYPES: [{ label: 'Problem' }, { label: 'Verbesserung' }],
  FEEDBACKCATEGORIES: [
    { label: 'Unwichtig' },
    { label: 'Wichtig' },
    { label: 'ASAP' },
  ],
  LANDMARKTYPES: [
    { label: 'Müllcontainer', isEvent: 0 },
    { label: 'Recyclingcenter', isEvent: 0 },
    { label: 'Müllsammelaktion', isEvent: 1 },
  ],
  LANDMARKS: [
    {
      landmarkTypeId: 1,
      name: 'ABK-Wertstoff-Zentrum Kiel',
      position: '[54.27659758334394, 10.164146288935642]',
      showFrom: 1715019654616,
      showUntil: 1715019654616,
      additionalInfo: '',
    },
  ],
  AMOUNTS: [
    { label: 'none', points: 0 },
    { label: 'small', points: 1 },
    { label: 'medium', points: 2 },
    { label: 'large', points: 3 },
    { label: 'x-large', points: 4 },
  ],
  CATEGORIES: [
    { label: 'none', points: 0 },
    { label: 'biodegradable', points: 1 },
    { label: 'recyclable', points: 2 },
    { label: 'residualWaste', points: 3 },
    { label: 'electronicWaste', points: 4 },
    { label: 'bulkyWaste', points: 5 },
    { label: 'constructionDebris', points: 6 },
    { label: 'hazardousWaste', points: 7 },
  ],
};

const initDb = async () => {
  await new Promise((res) => {
    db.serialize(async () => {
      try {
        for (const statement of createStatements) {
          db.run(statement);
        }

        for (const [tablename, data] of Object.entries(dummyData)) {
          if (!data.length) {
            continue;
          }

          const values = data.map(
            (e) =>
              `(${Object.values(e)
                .map((e) => `'${e}'`)
                .join(',')})`,
          );
          const cols = Object.keys(data[0]).join(',');

          db.prepare(`INSERT INTO ${tablename} (${cols}) VALUES ${values};`)
            .run()
            .finalize();
        }

        db.prepare(
          `
        INSERT INTO POSITIONSHARING (sharedByUserId, sharedForUserId)
        SELECT 6, userId FROM USERS WHERE email = '${process.env.BACKUP_EMAIL}'
        UNION ALL
        SELECT 22, userId FROM USERS WHERE email = '${process.env.BACKUP_EMAIL}';
        `,
        )
          .run()
          .finalize();
      } catch (e) {
        console.log('error', e);
      }
      res();
    });
  });

  db.close();
};

initDb();
