package com.hero.aem.core.models;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;

import org.junit.jupiter.api.Test;

class ProductAccordionModelTest {

    @Test
    void testInit() {
        ProductAccordionModel productAccordionModel = new ProductAccordionModel();
        productAccordionModel.init();
        assertTrue(productAccordionModel.getProductList().isEmpty());
    }

    @Test
    void testSetProductList() {
        ProductAccordionModel productAccordionModel = new ProductAccordionModel();
        productAccordionModel.setProductList(new ArrayList<>());
        assertTrue(productAccordionModel.getProductList().isEmpty());
    }

    @Test
    void testConstructor() {
        assertTrue((new ProductAccordionModel()).getProductList().isEmpty());
    }
}

