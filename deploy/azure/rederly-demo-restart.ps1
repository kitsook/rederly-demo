# Script to restart App Service on Azure. If the db is not using persistent storage, it will effectively
# reset the db if demo data is also set up to preload during startup.
#
# To run this script with Azure Automation Account, it needs to has the "AzureRM.Websites" module installed.
# The easiest way to do this is go to PowerShell Gallery at https://www.powershellgallery.com/packages/AzureRM.Websites/5.2.0 ,
# open the tab "Azure Automation" and clik "Deploy to Azure Automation" button
#
# This script is copied from https://stackoverflow.com/questions/47298375/how-to-restart-an-azure-appservice-from-azure-powershell
# Update "the-subscription-id", "your-resource-group-name", and "your-application-name" accordingly.
#
$connectionName = "AzureRunAsConnection" # this is the default connection created when you provision the Automation account,
                                         # you might need to change this to your own connection name
$servicePrincipalConnection = Get-AutomationConnection -Name $connectionName

$null = Add-AzureRmAccount `
    -ServicePrincipal `
    -TenantId $servicePrincipalConnection.TenantId `
    -ApplicationId $servicePrincipalConnection.ApplicationId `
    -CertificateThumbprint $servicePrincipalConnection.CertificateThumbprint

$null = Select-AzureRmSubscription -SubscriptionId 'the-subscription-id' ` # Needed if you have more than 1 subscription

Restart-AzureRmWebApp -ResourceGroupName your-resource-group-name -Name your-application-name