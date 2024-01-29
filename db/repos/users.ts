import {IDatabase, IMain} from 'pg-promise';
import {IUser} from '../models';
import {users as sql} from '../sql';

export class UsersRepository {

    /**
     * @param db
     * Automated database connection context/interface.
     *
     * If you ever need to access other repositories from this one,
     * you will have to replace type 'IDatabase<any>' with 'any'.
     *
     * @param pgp
     * Library's root, if ever needed, like to access 'helpers'
     * or other namespaces available from the root.
     */
    constructor(private db: IDatabase<any>, private pgp: IMain) {
    }

    // Returns all user records;
    all(): Promise<IUser[]> {
        return this.db.any(sql.all);
    }

    add(username: string, password: string, email: string, first_name: string, last_name: string): Promise<IUser[]> {
        return this.db.one(sql.add, [username, password, email, first_name, last_name]);
    }

    isUsernameTaken(username: string): Promise<IUser[]> {
        return this.db.any(sql.isUsernameTaken, username);
    }

    isEmailTaken(email: string): Promise<IUser[]> {
        return this.db.any(sql.isEmailTaken, email);
    }
}