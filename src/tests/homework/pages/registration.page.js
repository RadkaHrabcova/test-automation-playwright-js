
exports.RegistrationPage = class RegistrationPage {


        constructor(page) {
        this.page = page;

        this.nameField = this.page.getByLabel('Jméno a příjmení');
        this.emailField = this.page.getByLabel('Email');
        this.passwordField = this.page.getByLabel('Heslo');
        this.passwordConfirm = this.page.getByLabel('Kontrola hesla');
        this.registerButton = this.page.getByRole('button', { name: 'Zaregistrovat'});
        
        this.toast = this.page.locator('.toast-message');
        this.fieldError = this.page.locator('.invalid-feedback');
       
    }

    async open() {
        await this.page.goto('/registrace');
    }

    async registerWithUniqueEmail() {
        const uniqueEmail = `pavel${Date.now()}@gmail.com`;
        const userName = 'Pavel';
        await this.nameField.fill(userName);
        await this.emailField.fill(uniqueEmail);
        await this.passwordField.fill('1PavelOtak');
        await this.passwordConfirm.fill('1PavelOtak');
        await this.registerButton.click();

        return {userName, uniqueEmail};
    }

    async registerWithInvalidPassword() {
        const uniqueEmail = `Marek${Date.now()}@gmail.com`;
        await this.nameField.fill('Marek');
        await this.emailField.fill('marek@seznam.cz');
        await this.passwordField.fill('123456789');
        await this.passwordConfirm.fill('123456789');
        await this.registerButton.click();
    }
    
}
