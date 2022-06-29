<script lang="ts">
  import {
    FormGroup,
    Input,
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
  import { notifySlack } from "../lib/slack";
  import { annotateWithText } from "../lib/annotate";
  import { getUser } from "../lib/getUser";
  import { uploadImage } from "../lib/base64ToFile";

  let reportSubmitted = false;
  let reportText: string;
  let screenshot: any = {
    canvas: null,
    context: null,
  };

  const capturePipeline = () => {
    const { canvas, context } = captureScreen();
    draw(canvas, context);
    annotateWithText(canvas, context);

    screenshot = { canvas, context };
  };

  const submitReport = async () => {
    let author = getUser();
    let image = await uploadImage(screenshot.canvas.toDataURL()).then(res => res);
    if (reportText) {
      notifySlack(reportText, image, author);
      reportSubmitted = true;
    }
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
    style="padding: 1rem; background: url('../bugs_bunny.png') left bottom no-repeat; background-size: 35%; border: inset 10px transparent;"
  >
    <CardTitle
      style="font-family: 'Bangers', cursive; font-size: xx-large; color: #46908b; margin-top: 1em;"
      >Bugs Bunny</CardTitle
    >
    <CardSubtitle
      style="font-family: 'Caveat Brush', cursive; font-size: large; color: #46908b;"
      >Cool! Another bug! <br /> It looks like you tried to..</CardSubtitle
    >
    <CardBody style="opacity: 0.85;">
      <Alert
        color="success"
        isOpen={reportSubmitted}
        toggle={() => (reportSubmitted = false)}
      >
        Bug report submitted!
      </Alert>

      <FormGroup style="margin-left: 40%;">
        <Input
          id="additionalContext"
          type="textarea"
          label="Give additional context"
          style="height: 300px; background-color: #f5f5f5;"
          bind:value={reportText}
        />
        <Tooltip target="additionalContext" placement="top"
          >Is there any more context to be provided?</Tooltip
        >
      </FormGroup>
    </CardBody>

    <Container>
      <button class="save-button" on:click={submitReport}>Submit</button>
      <button class="save-button" on:click={capturePipeline}
        >Take Screenshot</button
      >
    </Container>
  </Card>
</main>

<style>
  main {
    width: 800px;
  }
  button {
    margin-bottom: 10px;
    background-color: #46908b;
    color: white;
    border: none;
    padding: 1em;
    border-radius: 5px;
  }
  button:hover {
    background-color: #185e59;
    color: white;
  }
</style>
