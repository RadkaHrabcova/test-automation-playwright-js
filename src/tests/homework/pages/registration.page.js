
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

    async registerUser({ email, userName, password }) {
        await this.nameField.fill(userName);
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.passwordConfirm.fill(password);
        await this.registerButton.click();
    }
    
}
