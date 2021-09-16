import { core } from '@kalisio/kdk/test.client'

export async function deleteOrganisation (page, name) {
  await core.clickLeftPaneAction(page, 'my-organisations', 1000) // wait for the collection to be rendered
  await core.clickCardAction(page, name, 'expand-action', 1000) // wait for the card to be opened
  await core.clickCardAction(page, name, 'remove-item-header')
  await core.type(page, '.q-dialog input', name)
  await core.click(page, '.q-dialog button:nth-child(2)')
  await page.waitForTimeout(2000)
}
