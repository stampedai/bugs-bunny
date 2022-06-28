<script lang="ts">
  import {
    FormGroup,
    Input,
    Button,
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    Alert,
    Container,
    Tooltip,
  } from "sveltestrap";
  import { draw } from "../lib/draw";
  import { captureScreen } from "../lib/capture";

  let reportSubmitted = false;
  let filter = { urls: ["https://app.stamped.ai/**"] };
  let opt_extraInfoSpec: string[] = [];
  let reportText: string;

  const capturePipeline = () => {
    const { canvas, context } = captureScreen();
    draw(canvas, context);
  };

  const callback = (details: any) => {
    console.log(details);
    let key = details.requestId;
    console.log(key)
    chrome.storage.local.set({ key: details }, () => {
      if (chrome.runtime.lastError) console.error(`Error setting ${key} to ${JSON.stringify(details)} - ${chrome.runtime.lastError.message}`);
    });
    // Getting
    chrome.storage.local.get(key, (data) => {
      console.log("data", data)
    });
  };

  chrome.runtime.onInstalled.addListener(callback);
  chrome.webRequest.onResponseStarted.addListener(
    callback,
    filter,
    opt_extraInfoSpec
  );

  const submitReport = () => {
    // https://hooks.slack.com/workflows/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
    // {
    //   "timestamp": "Example text",
    //   "report": "Example text"
    // }
    fetch(
      "https://hooks.slack.com/workflows/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",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          report: reportText,
        }),
      }
    )
      .then((res) => {
        console.log(res);
        reportSubmitted = true;
      })
      .catch((err) => {
        console.log(err);
        alert(err);
        reportSubmitted = false;
      });
  };
</script>

<svelte:head>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Bangers&family=Caveat+Brush&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap");
  </style>
</svelte:head>

<main>
  <div id="screenshot" />
  <Card
    class="text-center"
    style="background: url('../bugs_bunny.png') center bottom no-repeat; background-size: 40%;"
  >
    <CardTitle
      style="font-family: 'Bangers', cursive; font-size: xx-large; color: #46908b; -webkit-text-stroke: 1px black;"
      >Bugs Bunny</CardTitle
    >
    <CardSubtitle
      style="font-family: 'Caveat Brush', cursive; font-size: xx-large; color: #46908b; -webkit-text-stroke: 1px black;"
      >Cool! Another bug! <br /> It looks like you tried to..</CardSubtitle
    >
    <CardBody style="opacity: 0.75;">
      <Alert
        color="success"
        isOpen={reportSubmitted}
        toggle={() => (reportSubmitted = false)}
      >
        Bug report submitted!
      </Alert>

      <FormGroup>
        <Input
          id="additionalContext"
          type="textarea"
          label="Give additional context"
          style="height: 300px;"
          bind:value="{reportText}"
        />
        <Tooltip target="additionalContext" placement="top"
          >Is there any more context to be provided?</Tooltip
        >
      </FormGroup>
    </CardBody>

    <Container>
      <Button
        style="margin-bottom: 10px; background-color: #46908b; color: white;"
        class="save-button"
        on:click={submitReport}>Submit</Button
      >
      <Button
        style="margin-bottom: 10px; background-color: #46908b; color: white;"
        class="save-button"
        on:click={capturePipeline}>Take Screenshot</Button
      >
    </Container>
  </Card>
</main>

<style>
  main {
    width: 800px;
  }
</style>
