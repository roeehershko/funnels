import {AddUserDto, ViewUsersDto} from "./adapter.dto";

export enum SyncTypes { SINGLE = 1, MULTIPLE = 2 }

export interface Adapter {

    syncType: SyncTypes;

    addUser(data: AddUserDto);

    viewUserDeposits?(id: number);

    viewUsersDeposits?(options: ViewUsersDto);
}
