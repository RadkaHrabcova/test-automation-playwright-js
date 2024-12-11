exports.AppPage = class AppPage {

    constructor(page, url) {
        this.url = url;
        this.page = page;
       /* this.toast = this.page.locator('.toast-message');
        this.navbarRight = this.page.locator('.navbar-right');
        this.usernameDropdown = this.navbarRight.locator('[data-toggle="dropdown"]');
        this.logoutLink = this.page.locator('#logout-link');*/
        this.forTeacherMenuItemLocator = page.getByRole('button', { name: 'Pro učitelé' })
        this.newOrderLocator = page.getByRole('link', { name: 'Objednávka pro MŠ/ZŠ' })

    }

    async open() {
        await this.page.goto('/' + this.url);
    }

    async createNewOrder() {
        await this.forTeacherMenuItemLocator.click();
        await this.newOrderLocator.click();
    }

 
}
