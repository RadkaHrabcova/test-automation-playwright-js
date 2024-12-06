/**
 * Page object describing the applications page
 */
exports.ApplicationsPage = class ApplicationsPage {

    constructor(page,) {
        this.page = page;
        this.applicationsLink = this.page.getByRole('link', {name: 'Přihlášky'});
        this.loadingIndicator = this.page.locator('#DataTables_Table_0_processing');
        this.applicationsTable = this.page.locator('.dataTable');
        this.applicationsTableRows = this.applicationsTable.locator('tbody').locator('tr');
        this.searchField = this.page.locator('input[type="search"]');
    }

    async goToApplicationsPage() {
        await this.applicationsLink.click();
    }

    async waitForTableToLoad() {
        await this.page.waitForLoadState();
        await this.loadingIndicator.waitFor({state: 'hidden'});
    }

    async getApplicationsTableRows() {
    const allRows = await this.applicationsTableRows.all();

    const tableRows = [];
    for (const row of allRows) {
        tableRows.push(new TableRow(row));
    }
    return tableRows;
  
    }

    async searchInApplicationsTable(text) {
        await this.searchField.fill(text);
        await this.loadingIndicator.waitFor({state: 'visible'});
    }

}

class TableRow {
   constructor(rowLocator, page) {
   this.rowLocator = rowLocator;
   this.page = page;
}
/*
async getName() {
    return await this.rowLocator.locator('td').nth(0).textContent();
}

async getDate() {
    return await this.rowLocator.locator('td').nth(1).textContent();
}

async getPaymentType() {
    return await this.rowLocator.locator('td').nth(2).textContent();
}

async getToPay() {
    return await this.rowLocator.locator('td').nth(3).textContent();
}*/
async getValues() {
    const columns = this.rowLocator.locator('td')


    return {
        name: await columns.nth(0).textContent(),
        date: await columns.nth(1).textContent(),
        paymentType: await columns.nth(2).textContent(),
        toPay: await columns.nth(3).textContent()
    }
}
}