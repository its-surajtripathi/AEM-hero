package com.hero.aem.core.workflow;

import com.adobe.granite.asset.api.Asset;
import com.adobe.granite.asset.api.AssetManager;
import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowProcess;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import com.google.gson.JsonObject;
import com.hero.aem.core.util.CSVUtils;
import com.hero.aem.core.util.JsonComparator;
import com.hero.aem.core.util.StaticWrapper;

import org.apache.commons.io.input.BOMInputStream;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;

/**
 * PriceIngestionWorkflow
 * 
 * This Workflow is used to ingest city information into JCR.
 * 
 * The workflow can be triggered by multiple launchers and can help add nodes.
 * Launcher should be configured to run only in Author mode so that the whole
 * package can be replicated.
 * 
 * The path is passed through model as of now which points to /in/ node but
 * based on the future expansion, the model should pass on dynamic rootPath.
 */
@Component(service = WorkflowProcess.class, property = "process.label=City Ingestion Job")
public class CityMasterWorkflow implements WorkflowProcess {
    private static final Logger log = LoggerFactory.getLogger(CityMasterWorkflow.class);

    StaticWrapper jcrUtilWrapper = new StaticWrapper();

    /**
     * Entry method to contain the workflow logic.
     * 
     * This validates the resource if the resource is of type dam:Asset and streams
     * it to get a Buffered Reader.
     * 
     * This reader can be used to parse the data and create nodes.
     * 
     */
    @Override
    public final void execute(WorkItem workItem, WorkflowSession workflowSession, MetaDataMap metaDataMap)
            throws WorkflowException {

        String rootPath = workItem.getWorkflowData().getMetaDataMap().get("cityIngestionPath", String.class);
        String wfPayload = null;
        ResourceResolver resourceResolver = workflowSession.adaptTo(ResourceResolver.class);
        wfPayload = (String) workItem.getWorkflowData().getPayload();
        try {
            log.info("valid resource");
            AssetManager assetMgr = resourceResolver.adaptTo(AssetManager.class);
            Asset xlAsset = assetMgr.getAsset(wfPayload);
            if (xlAsset != null) {
                BOMInputStream bis = new BOMInputStream(xlAsset.getRendition("original").getStream());
                BufferedReader csvFile = new BufferedReader(new InputStreamReader(bis));
                ArrayList<JsonObject> csvDataList = CSVUtils.getDataFromFile(csvFile);
                JsonComparator comparator = new JsonComparator("state", "city");
                Collections.sort(csvDataList, comparator);
                createCityData(csvDataList, resourceResolver, rootPath);
            }
        } catch (IOException e) {
            log.error("IOException {}", e);
        }
    }

    public void createCityData(ArrayList<JsonObject> csvDataList, ResourceResolver resourceResolver, String rootPath) {
        Session session = null;
        try {
            session = resourceResolver.adaptTo(Session.class);
            for (JsonObject rowData : csvDataList) {
                String stateName = rowData.get("state_code").getAsString();
                if (StringUtils.isBlank(stateName) || stateName.contains("/")) {
                    continue;
                }
                String cityName = CSVUtils.getNodeName(rowData, "city");
                String cityPath = String.join("/", rootPath, stateName, cityName);
                Node cityNode = jcrUtilWrapper.createPath(cityPath, session);
                for (String keys : rowData.keySet()) {
                    String value = rowData.get(keys).getAsString().replaceAll("^\"|\"$", "");
                    if (StringUtils.isNotBlank(value)) {
                        cityNode.setProperty(keys, value);
                    }
                }
                cityNode.getParent().setProperty("state_code", rowData.get("state_code").getAsString());
                cityNode.getParent().setProperty("state", rowData.get("state").getAsString());
                cityNode.getParent().setProperty("state_id", rowData.get("state_id").getAsString());
            }
            log.info("Nodes created Successfully");
        } catch (RepositoryException e) {
            log.error("RepositoryException {}", e);
        }

    }

}
