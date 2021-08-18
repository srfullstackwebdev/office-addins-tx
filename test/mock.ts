import * as sinon from "sinon";
import { Excel, OfficeExtension } from "@microsoft/office-js/dist/excel.js";
import { run } from "../src/test-file";

OfficeExtension.TestUtility.setMock(true);

import * as assert from "assert";

async function getSelectedRangeAddress(context: Excel.RequestContext): Promise<string> {
  const range: Excel.Range = context.workbook.getSelectedRange();

  range.load("address");
  await context.sync();

  return range.address;
}

/* global before, it, global */

// eslint-disable-next-line no-undef
describe(`Test Task Pane Project mocking`, function () {
  before("Setup global variable", function () {
    global.Excel = Excel;
  });
  it("Validate mock within same file", async function () {
    const context: Excel.RequestContext = new Excel.RequestContext();
    const range: Excel.Range = context.workbook.getSelectedRange();

    range.setMockData({
      address: "C2",
    });
    sinon.stub(context.workbook, "getSelectedRange").callsFake(() => range);

    const contextSyncSpy = sinon.spy(context, "sync");
    const loadSpy = sinon.spy(range, "load");

    assert.strictEqual(await getSelectedRangeAddress(context), "C2");
    assert(contextSyncSpy.calledOnce);
    assert(loadSpy.withArgs("address").calledOnce);
  });
  it("Validate mock within different file", async function () {
    const runSpy = sinon.spy(Excel, "run");
    await run();
    assert(runSpy.calledOnce);
  });
});
