exports.AppPage = class AppPage {
  constructor(page, url) {
    this.url = url;
    this.page = page;
    this.forTeacherMenuItemLocator = page.getByRole("button", {
      name: "Pro učitelé",
    });
    this.newOrderLocator = page.getByRole("link", {
      name: "Objednávka pro MŠ/ZŠ",
    });
  }

  async open() {
    await this.page.goto("/" + this.url);
  }

  async createNewOrder() {
    await this.forTeacherMenuItemLocator.click();
    await this.newOrderLocator.click();
  }
};
