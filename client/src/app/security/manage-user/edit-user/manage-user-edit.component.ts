/* 
* Generated by
* 
*      _____ _          __  __      _     _
*     / ____| |        / _|/ _|    | |   | |
*    | (___ | | ____ _| |_| |_ ___ | | __| | ___ _ __
*     \___ \| |/ / _` |  _|  _/ _ \| |/ _` |/ _ \ '__|
*     ____) |   < (_| | | | || (_) | | (_| |  __/ |
*    |_____/|_|\_\__,_|_| |_| \___/|_|\__,_|\___|_|
*
* The code generator that works in many programming languages
*
*			https://www.skaffolder.com
*
*
* You can generate the code from the command-line
*       https://npmjs.com/package/skaffolder-cli
*
*       npm install -g skaffodler-cli
*
*   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
*
* To remove this comment please upgrade your plan here: 
*      https://app.skaffolder.com/#!/upgrade
*
* Or get up to 70% discount sharing your unique link:
*       https://app.skaffolder.com/#!/register?friend=5e41027e7add745c918f4794
*
* You will get 10% discount for each one of your friends
* 
*/
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { User } from 'src/app/domain/globify-x_db/user';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from 'src/app/security/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SHA3 } from 'sha3';
import { ViewChild, ElementRef } from '@angular/core';

declare var jQuery: any;
/**
 * Edit user by Admin
 */
@Component({
    selector: 'app-manage-user-edit',
    templateUrl: './manage-user-edit.component.html',
})
export class ManageUserEditComponent implements OnInit {

    user: User;
    passwordNew: string;
    passwordNewConfirm: string;
    passwordAdmin: string;
    showError: boolean;
    @ViewChild('closeModal') closeModal: ElementRef;

    constructor(
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {

        this.route.params.subscribe(params => {

            if (params.id === 'new') {
                // New User
                this.user = new User(null, null, null, []);
            } else {
                // Get User
                this.userService.get(params.id).subscribe(user => this.user = user);
            }
        });
    }

    /**
     * Save or create User
     */
    save(): void {
        if (this.user._id) {
            // Save
            this.userService.update(this.user).subscribe(data => this.router.navigateByUrl('/manage-users'));
        } else {
            // Create
            const hash = new SHA3(512);
            hash.update(this.user.password);
            this.user.password = hash.digest('hex');
            this.userService.create(this.user).subscribe(data => this.router.navigateByUrl('/manage-users'));
        }
    }

    /**
     * Delete user
     */
    deleteUser(): void {
        this.userService.remove(this.user._id).subscribe(data => this.router.navigateByUrl('/manage-users'));
    }

    /**
     * Add roles to user
     *
     * @param {*} role Role to add
     */
    addRole(role: any): void {
        if (role.value) {
            this.user.roles.push(role.value);
            role.value = '';
        }
    }

    /**
     * Remove role from user
     *
     * @param {number} index Index of the role in the array
     */
    removeRole(index: number) {
        this.user.roles.splice(index, 1);
    }

    /**
     * Change user password
     */
    changePassword() {
        const hashNewPwd = new SHA3(512);
        hashNewPwd.update(this.passwordNew);
        var passwordNew = hashNewPwd.digest('hex');

        const hash = new SHA3(512);
        hash.update(this.passwordAdmin);
        var passwordAdmin = hash.digest('hex');

        this.userService.changePassword(this.user._id, passwordNew, passwordAdmin).subscribe(data => {
            this.passwordAdmin = null;
            this.passwordNew = null;
            this.passwordNewConfirm = null;
            this.showError = false;
            this.closeModal.nativeElement.click();
        }, err => {
            this.showError = true;
        });
    }

    trackByFn(index: number, item: any) {
        return index;
    }
}
