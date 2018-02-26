import {Component} from "@nestjs/common";
import {Adapter, SyncTypes} from "../common/adapter/adapter.type";
import {AddUserDto, ViewUsersDto} from "../common/adapter/adapter.dto";
import {AdapterAbstract} from "../common/adapter/adapter.abstract";
import {AdapterWrapper} from "../common/adapter/adapter.component";
import * as request from 'request';

@Component()
export class CryptoVipAdapter extends AdapterAbstract implements Adapter {

    syncType = SyncTypes.MULTIPLE;
    adapterName = 'cryptovip';

    async addUser(data: AddUserDto) {

        let formData = {
            MODULE: 'Customer',
            COMMAND: 'add',
            api_username: 'Mayaff',
            api_password: 'qZ8yKqjK8',
            a_aid: 'Mayaff',
            c_aid: 'Maya1',
            FirstName: data.first_name,
            LastName: data.last_name,
            email: data.email,
            password: data.password,
            PhoneNumber: data.phone,
            country: data.country.toUpperCase(),
            siteLanguage: 'EN',
            jsonResponse: true
        };

        console.log(formData);
        let options = {
            url: 'http://api.vip-crypto.com/CrmApiModuleService.svc/Execute',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: formData
        };

        return new Promise(function (resolve) {
            request(options, function (error, response, body) {
                body = JSON.parse(body);
                if (body.status.operation_status === 'successful') {
                    resolve({
                        status: 1,
                        loginUrl: '//vip-crypto.com/Registration-Confirmation/?uid=' + body.status.data_CustomerSessionId
                    })
                }
                else {
                    let err = 'Temporally error, please try again later';

                    try {
                        err = body.status.errors.error;
                    }
                    catch(e) {
                        err = 'Temporally error, please try again later';
                        // Log this
                    }

                    resolve({
                        status: 0,
                        error: err
                    });
                }
            });
        });
    }

    viewUsersDeposits(options: ViewUsersDto) {

    }

}
