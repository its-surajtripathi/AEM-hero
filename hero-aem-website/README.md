# Introduction 
TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project. 

# Getting Started
TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:
1.	Installation process
2.	Software dependencies
3.	Latest releases
4.	API references

# Build and Test
TODO: Describe and show how to build your code and run the tests. 

# Contribute
TODO: Explain how other users and developers can contribute to make your code better. 

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)

# Premia 
To deploy run `mvn clean install -PautoInstallPackage`
## Branching and Merging Strategy (UI / AEM) : 

1. Feature branches should be created for each ticket / feature separately. Naming convention of feature branch "feature/premia/<<Ticket-Number>>". 
2. Base branch for creating feature branches will always be "master" by default. (Please discuss use case before considering any other branch as base)
3. PR should be raised for merging feature branches to "develop" for initial QA and validation. Please Do Not merge PRs without approvals. 
4. PR should be raised for merging feature branches to "master" only once the ticket / feature is approved by QA. 

    Branch              | Environment | Purpose
    --------------------|-------------|----------
    feature/premia/xx   | Local       | Local Development
    develop             | Dev         | Dev / QA validation
    master              | Stage, Prod | Live

QA Strategy : 
1. Initial QA validation can be on local Author in case of emergency till the code is deployed to Dev Env. 
2. QA validation will only be considered complete if tested and approved on Dev Env. 
3. QA should maintain separate content for testing purposes.
4. Final UI Validation should be approved only after verifying on dispatcher URL. 

## Access: 
Jira: https://rafters.atlassian.net/jira/software/projects/HP/boards/164
Dev Environment : 
Hero Premia Dev Env can be accessed using below URLs. (Access will be granted asap) 
- Author : https://author-p78502-e680953.adobeaemcloud.com/
- Publish : https://publish-p78502-e680953.adobeaemcloud.com/
- Dispatcher : https://dev1.heromotocorp.com/ 

## Installation:
Refer: https://experienceleague.adobe.com/docs/experience-manager-learn/foundation/development/set-up-a-local-aem-development-environment.html?lang=en 

- JDK `java --version`. 
    * MAC: `brew install openjdk@11`
    * Windows: https://jdk.java.net/archive/
- AEM SDK: https://drive.google.com/drive/folders/1Ep8pH7u4-QOPR7oUimu18hO80SQo411w?usp=sharing 
- Maven `mvn --version`. 
    * MAC: `brew install maven`.
    * Windows: https://dlcdn.apache.org/maven/maven-3/3.9.2/binaries/apache-maven-3.9.2-bin.zip
- Git  
    * To clone the repo you will need a PA-Token. Refer: https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=Windows 
- Node LTS version
- NPM LTS version
- IDE:
    * vs code ( I do use and recommended for UI team)
    * Any one of the IDE ( VS code, Eclipse, IntelliJ)

## Folder structure
apps
|--hero-aem-website
    |--components
        |--content
            |--premia
                |-- //components related to Hero premia project

### 
- `keytool -importcert -file "C:/Users/230291/Documents/Moonraft/repo/azuredev/hero-aem-website/tdots.in.crt" -alias sms-api-ssl -keystore "C:\Open-Jdk-11.0.2\lib\security\cacerts"`
C:\Open-Jdk-11.0.2\lib\security\cacerts >> JAVA HOME security FOLDER 
C:/Users/230291/Documents/Moonraft/repo/azuredev/hero-aem-website/tdots.in.crt >> certificate path in your repository