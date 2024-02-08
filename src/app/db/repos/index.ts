import { UsersRepository } from './users';
import { InitTable } from './init';

// Database Interface Extensions:
interface IExtensions {
    users: UsersRepository,
    initTable: InitTable
}

export {
    IExtensions,
    UsersRepository,
    InitTable,
};