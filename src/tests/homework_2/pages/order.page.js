exports.OrderPage = class OrderPage {
  constructor(page, url) {
    this.page = page;
    this.url = "/";
    this.pageHeader = this.page.getByRole("heading", {
      name: "Nová objednávka",
    });
    this.icoField = this.page.locator("#ico");
    this.clientField = this.page.locator("#client");
    this.addressField = this.page.locator("#address");
    this.substituteField = this.page.locator("#substitute");
    this.contactNameField = this.page.locator("#contact_name");
    this.contactPhoneField = this.page.locator("#contact_tel");
    this.contactEmailField = this.page.locator("#contact_mail");
    this.startDateField = this.page.locator("#start_date_1");
    this.endDateField = this.page.locator("#end_date_1");
    this.suburbanCampTab = this.page.getByRole("tab", {
      name: "Příměstský tábor",
    });
    this.numberOfStudentsField = this.page.locator("#camp-students");
    this.studentAgeField = this.page.locator("#camp-age");
    this.numberOfTeachersField = this.page.locator("#camp-adults");
    this.submitButton = this.page.getByRole("button", {
      name: "Uložit objednávku",
    });
    this.thankYouForOrderMessage = this.page.getByRole("heading", {
      name: "Děkujeme za objednávku",
    });
    this.toast = this.page.locator(".toast-message");
    this.fieldError = this.page.getByText("Vyplňte prosím toto pole.");
  }

  async open() {
    await this.page.goto("/objednavka/pridat");
  }
};
