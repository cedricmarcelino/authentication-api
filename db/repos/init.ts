import {IDatabase, IMain} from 'pg-promise';
import {init as sql} from '../sql';

export class InitTable {

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
    users(): Promise<any> {
        return this.db.any(sql.members);
    }
}