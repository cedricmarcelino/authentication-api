import * as dbConfig from '../db-config.json'; // db connection details
import pgPromise from 'pg-promise'; // pg-promise core library
import { IInitOptions, IDatabase, IMain } from 'pg-promise';
import { IExtensions, UsersRepository } from './repos';

type ExtendedProtocol = IDatabase<IExtensions> & IExtensions;

// pg-promise initialization options:
const initOptions: IInitOptions<IExtensions> = {
    // Extending the database protocol with our custom repositories;
    // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
    extend(obj: ExtendedProtocol, dc: any) {
        // Database Context (dc) is mainly needed for extending multiple databases with different access API.

        // Do not use 'require()' here, because this event occurs for every task and transaction being executed,
        // which should be as fast as possible.
        obj.users = new UsersRepository(obj, pgp);
    }
};

// Initializing the library:
const pgp: IMain = pgPromise(initOptions);

// Creating the database instance with extensions:
const dbHost = process.env.DB_HOST || 'localhost'
const db: ExtendedProtocol = pgp(`postgres://postgres:admin@${dbHost}:5432/blog_api`);

// Alternatively, you can get access to pgp via db.$config.pgp
// See: https://vitaly-t.github.io/pg-promise/Database.html#$config
export {db, pgp};