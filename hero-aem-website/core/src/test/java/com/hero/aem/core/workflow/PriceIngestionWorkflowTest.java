/*
 * #%L
 * ACS AEM Commons Bundle
 * %%
 * Copyright (C) 2020 Adobe
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
package com.hero.aem.core.workflow;

import com.adobe.granite.asset.api.Asset;
import com.adobe.granite.asset.api.AssetManager;
import com.adobe.granite.asset.api.Rendition;
import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowData;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import com.hero.aem.core.util.StaticWrapper;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.mockito.Mockito.when;

import java.io.IOException;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

@ExtendWith(AemContextExtension.class)
public class PriceIngestionWorkflowTest {

    @InjectMocks
    PriceIngestionWorkflow priceIngestionWorkflow;

    @Mock
    StaticWrapper jcrUtilWrapper;

    @Mock
    WorkItem workItem;

    @Mock
    WorkflowSession workflowSession;

    @Mock
    MetaDataMap metaDataMap;

    @Mock
    WorkflowData workflowData;

    @Mock
    ResourceResolver resolver;

    @Mock
    AssetManager assetMgr;

    @Mock
    Asset xlAsset;

    @Mock
    Session session;

    @Mock
    Node node;

    @Mock
    Rendition assetRendition;

    @BeforeEach
    void init() throws IOException {
        MockitoAnnotations.openMocks(this);
    }

    /**
     * IF the property doesn’t exist on the source, THEN do nothing (AEM will never
     * remove a property entirely, so empty values are allowed after a property is
     * created)
     * 
     * @throws WorkflowException
     */
    @Test
    public void testExecute() throws WorkflowException {
        try {
            when(workItem.getWorkflowData()).thenReturn(workflowData);
            when(workflowData.getMetaDataMap()).thenReturn(metaDataMap);
            when(workflowData.getPayload()).thenReturn("/content/dam/hero-aem-website/prices/in/price_sample.csv");
            when(metaDataMap.get("priceIngestionPath", String.class)).thenReturn("/content/hmc/prices/in");
            when(workflowSession.adaptTo(ResourceResolver.class)).thenReturn(resolver);
            when(resolver.adaptTo(AssetManager.class)).thenReturn(assetMgr);
            when(assetMgr.getAsset("/content/dam/hero-aem-website/prices/in/price_sample.csv")).thenReturn(xlAsset);
            when(xlAsset.getRendition("original")).thenReturn(assetRendition);
            when(resolver.adaptTo(Session.class)).thenReturn(session);
            when(assetRendition.getStream()).thenReturn(this.getClass().getResourceAsStream("price_sample.csv"));
            when(jcrUtilWrapper.createValidName("DESTINI 125 XTEC")).thenReturn("destini_125_xtec");
            when(jcrUtilWrapper.createValidName("NEW SUPER SPLENDOR")).thenReturn("new_super_splendor");
            when(jcrUtilWrapper.createPath("/content/hmc/prices/in/destini_125_xtec/ap", session)).thenReturn(node);
            when(jcrUtilWrapper.createPath("/content/hmc/prices/in/destini_125_xtec/ap/adoni/hdeschrlmfi", session))
                .thenReturn(node);
            when(jcrUtilWrapper.createPath("/content/hmc/prices/in/destini_125_xtec/ap/amalapuram/hdeschrlmfi", session))
                .thenReturn(node);
            when(jcrUtilWrapper.createPath("/content/hmc/prices/in/new_super_splendor/an/port_blair/hspsrhsscfi", session))
                .thenReturn(node);

            when(node.getParent()).thenReturn(node);
            priceIngestionWorkflow.execute(workItem, workflowSession, metaDataMap);
        } catch (RepositoryException e) {
            e.printStackTrace();
        }
    }
}
