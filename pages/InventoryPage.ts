import { expect, Locator, Page } from "@playwright/test";
import * as data from "../tests_data/test_data.json"


export class InventoryPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly shoppingCartButton: Locator;
  readonly addBackBackButton: Locator;
  readonly addTocart : Locator;
  readonly productSort : Locator;
  readonly activeSort : Locator;
  readonly itemName : Locator;
  readonly cart : Locator;
  readonly openMenu : Locator;
  readonly closeMenu : Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator(".title");
    this.shoppingCartButton = page.locator(".shopping_cart_link");
    this.addBackBackButton = page.locator("#add-to-cart-sauce-labs-backpack");
    this.addTocart= page.locator("text=Add to cart");
    this.productSort = page.locator(".product_sort_container");
    this.activeSort = page.locator(".active_option");
    this.itemName = page.locator(".inventory_item_name");
    this.cart = page.locator("#shopping_cart_container");
    this.openMenu = page.locator("img[alt='Open Menu']");
    this.closeMenu = page.locator("img[alt='Close Menu']");

  }

  async gotoShoppingCart() {
    await this.shoppingCartButton.click();
  }


  async SortItems(sortBy: string) {
    //we can choose to sort items them by all possible options
    await this.productSort.waitFor({ state: 'visible' });
    switch (sortBy){
      case "Price (high to low)":
        await this.productSort.selectOption({value:"hilo"});
        break;
      case "Price (low to high)":
        await this.productSort.selectOption({value:"lohi"});
        break;
      case "Name (A to Z)":
        await this.productSort.selectOption({value:"az"});
        break;
      case "Name (Z to A)":
        await this.productSort.selectOption({value:"za"});
        break;
      default:
        break
    }  
    await this.activeSort.waitFor({ state: 'visible' });
  }

  async addBackPack(itemNumber: number, sortBy: string) {
    // we can use this function for diferent numbers of item not only the 3 fist items
    this.SortItems(sortBy)
    expect(this.activeSort).toHaveText(sortBy);
    let itemsName :string[] =[];
    for (let i=0;i< itemNumber;i++){
    await this.addTocart.first().click();
    const itemName = await this.itemName.nth(i).textContent();
    itemsName = itemsName.concat(itemName);
    }
    return itemsName;
  }

  async problemSortItem( sortBy: string) {
   
    this.SortItems(sortBy)
    expect(this.activeSort).not.toHaveText(sortBy);
  }
  async errorSortItem( sortBy: string) {
    this.page.on('dialog', async(alert) =>{
      const errorMessage = alert.message();
      await alert.accept();
      console.log(errorMessage);
      expect(errorMessage).toBe(data.sortingErrorMessage)
      
    })
    await this.SortItems(sortBy)
  }

  async checkTransformvValue (element){
    const transformValue = await element.evaluate(el => {
      const computedStyle = window.getComputedStyle(el);
      return computedStyle.transform;
      
    });
    console.log("trasform value: "+transformValue)
    expect(transformValue).toBe(data.transformRotation);
    
  }

  async visualError(){
    this.checkTransformvValue(this.openMenu);
    this.checkTransformvValue(this.cart);
    this.checkTransformvValue(this.closeMenu);
  }
}
