const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const cfnresponse = require("cfn-response");
const https = require("https");
const url = require("url");

cfnresponse.send = async (event, context, responseStatus, responseData, physicalResourceId, noEcho, reason) => {
    return new Promise((resolve, reject) => {
        try {
            const responseBody = JSON.stringify({
                Status: responseStatus,
                Reason: reason || `See the details in CloudWatch Log Stream: ${context.logStreamName}`,
                PhysicalResourceId: physicalResourceId || context.logStreamName,
                StackId: event.StackId,
                RequestId: event.RequestId,
                LogicalResourceId: event.LogicalResourceId,
                NoEcho: noEcho || false,
                Data: responseData,
            });

            console.log("Response body:\n", responseBody);

            const parsedUrl = url.parse(event.ResponseURL);
            const options = {
                hostname: parsedUrl.hostname,
                port: 443,
                path: parsedUrl.path,
                method: "PUT",
                headers: {
                    "content-type": "",
                    "content-length": responseBody.length,
                },
            };

            const request = https.request(options, (response) => {
                console.log("Status code: " + response.statusCode);
                console.log("Status message: " + response.statusMessage);
                resolve();
            });

            request.on("error", (error) => {
                console.log("send(..) failed executing https.request(..): " + error);
                reject(error);
            });

            request.write(responseBody);
            request.end();
        } catch (error) {
            console.log("send(..) failed: " + error);
            reject(error);
        }
    });
};

async function invokeLambda(functionName, event) {
    try {
        const client = new LambdaClient();
        const response = await client.send(
            new InvokeCommand({
                FunctionName: functionName,
                Payload: JSON.stringify(event),
            })
        );
        const decoder = new TextDecoder("utf-8");
        const payloadString = decoder.decode(response.Payload);
        const payload = JSON.parse(payloadString);

        return payload;
    } catch (error) {
        throw new Error(`Lambda invocation failed: ${error.message}`);
    }
}

exports.handler = async (event, context) => {
    console.log("event:", event);

    const resourceProperties = event.ResourceProperties;
    const functionName = resourceProperties.LambdaFunctionName;

    if (!functionName) {
        const errorMessage = "Lambda invocation failed: LambdaFunctionName must be provided in event.ResourceProperties.";
        console.error(errorMessage);
        await cfnresponse.send(event, context, cfnresponse.FAILED, {}, errorMessage, false, errorMessage);
    } else {
        try {
            const payload = await invokeLambda(functionName, event);

            console.log("lambda response:", payload);

            if (payload.StatusCode !== 200) {
                const errorMessage = `Lambda invocation failed: ${payload.Body.Error}`;
                await cfnresponse.send(event, context, cfnresponse.FAILED, {}, errorMessage, false, errorMessage);
            } else {
                await cfnresponse.send(event, context, cfnresponse.SUCCESS, { Response: JSON.stringify(payload) }, "Lambda invocation succeeded", false, "Lambda invocation succeeded");
            }
        } catch (error) {
            const errorMessage = `Lambda invocation failed: ${error.message}`;
            console.error(errorMessage);
            await cfnresponse.send(event, context, cfnresponse.FAILED, {}, errorMessage, false, errorMessage);
        }
    }
};
