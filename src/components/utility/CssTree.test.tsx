﻿import CssNode from "./CssTree";
import { arraysEqual } from "../Helpers";

function makeCssTree() {
    return CssNode.load({
        "name": "Rich Text",
        "selector": ".rich-text",
        "properties": [],
        "children": [
            {
                "children": [
                    {
                        "children": [],
                        "name": "List Item",
                        "selector": "li",
                        "properties": [["list-style-type", "square"]]
                    }
                ],
                "name": "Lists",
                "selector": "ul",
                "properties": [["padding-left", "1.5em"]]
            }
        ]
    });
}

test('findNode Test', () => {
    const cssNode = makeCssTree();
    const listCss = cssNode.findNode(['Lists']) as CssNode;
    const listItemCss = cssNode.findNode(['Lists', 'List Item']) as CssNode;

    expect(listCss).toBeDefined();
    expect(listCss.fullSelector).toEqual('.rich-text ul');

    expect(listItemCss).toBeDefined();
    expect(listItemCss.fullSelector).toEqual('.rich-text ul li');
})

test('find Test', () => {
    const cssNode = makeCssTree();
    const listCss = cssNode.findNode(['Lists']) as CssNode;
    const listItemCss = cssNode.findNode(['Lists', 'List Item']) as CssNode;

    expect(listCss).toBeDefined();
    expect(arraysEqual(listCss.fullPath, ['Lists'])).toBeTruthy();

    expect(listItemCss).toBeDefined();
    expect(arraysEqual(listItemCss.fullPath, ['Lists', 'List Item'])).toBeTruthy();
})