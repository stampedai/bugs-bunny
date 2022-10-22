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

  import { draw, restoreDrawings } from "../lib/draw";
  import { captureScreen } from "../lib/capture";
  import { notifySlack } from "../lib/slack";
  import { annotateWithText, restoreAnnotations } from "../lib/annotate";
  import { uploadImage } from "../lib/base64ToFile";
  import { getUser } from "../lib/getUser";

  let reportSubmitted = false;
  let reportText: string;
  let title: string;
  let screenshot: any = {
    canvas: null,
    context: null,
  };
  let fileInput: any;
  let filesList: any[] = [];
  let drawings: any[] = [];
  let annotations: any[] = [];

	const onFileSelected = (e: any) => {
    let file = e.target.files[0];
    filesList.push(file);
  }

  addEventListener("keydown", (event: KeyboardEvent) => {
    if (reportText) {
      reportSubmitted = false;
    }
    if (event.ctrlKey && event.key === "z") {
      if (screenshot.canvas && screenshot.context && drawings.length > 0) {
        drawings.pop();
        for (let i = drawings.length - 1; i >= 0; i--) {
          const drawing = drawings[i];
          if (drawing.cutoff) {
            break;
          }
          drawings.pop();
        }
        redraw();
      }
    }
  });

  const redraw = () => {
    screenshot.context.clearRect(
      0,
      0,
      screenshot.canvas.width,
      screenshot.canvas.height
    );
    screenshot.context.drawImage(
      screenshot.image,
      0,
      0,
      screenshot.canvas.width,
      screenshot.canvas.height
    );
    restoreAnnotations(screenshot.context, annotations);
    restoreDrawings(screenshot.context, drawings);
  };

  const penDrawingTool = () =>
    draw(screenshot.canvas, screenshot.context, "pen", drawings);
  const highlightDrawingTool = () =>
    draw(screenshot.canvas, screenshot.context, "highlight", drawings);
  const markerDrawingTool = () =>
    draw(screenshot.canvas, screenshot.context, "marker", drawings);
  const textAnnotationTool = () =>
    annotateWithText(screenshot.canvas, screenshot.context, annotations);

  const capturePipeline = () => {
    const { canvas, context, image }: any = captureScreen();
    draw(canvas, context, "", drawings);
    screenshot = { canvas, context, image };
  };

  // add a bi weekly jira update to slack

  const submitRequest = async (type: string) => {
    let author = await getUser();
    author.email ? author : author.email = "Unknown";
    if (screenshot.canvas) {
      await uploadImage(screenshot.canvas.toDataURL()).then((res) => {
        if (res) {
          filesList.push(res);
          if (reportText) {
            notifySlack(`${type}: ${title}`, reportText, filesList, author.email);
            reportSubmitted = true;
          }
          return res;
        }
      });
    } else {
      if (reportText) {
        notifySlack(`${type}: ${title}`, reportText, filesList, author.email);
        reportSubmitted = true;
      }
    }
    (document.getElementById("title") as HTMLInputElement).value = "";
    (document.getElementById("additionalContext") as HTMLInputElement).value = "";
    (document.getElementById("files") as HTMLInputElement).value = "";
    title = "";
    reportText = "";
    filesList = [];
  };
</script>

<svelte:head>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Bangers&family=Caveat+Brush&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap");

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

    .hidden {
      display: none;
    }
  </style>
</svelte:head>

<main>
  <div id="screenshot" />
  <div>
    <svg
      id="pen"
      class="hidden"
      on:click={penDrawingTool}
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="128"
      height="128"
      style="enable-background:new 0 0 128 128; transform: scale(0.25);"
    >
      <g id="Layer_2">
        <g>
          <path
            d="M44.88,81.1L26.22,92.72l-8.25,24.93c-0.45,1.37,1.2,2.45,2.27,1.48c5.72-5.16,15.91-13,19.98-7.58 l10.48-26.12L44.88,81.1z"
            style="fill:#BDBDBD;"
          />
          <path
            d="M39.41,110.71c0.28-7.19,5.75-19.78,8.18-25.03c0.06-0.12-0.12-0.21-0.18-0.09l-12.67,22.15 c-0.62,1.14-1.01,1.94-1.23,2.51l1.65-0.4c0.97-0.25,2.61-0.05,3.75,0.48L39.41,110.71z"
            style="fill:#FAFAFA;"
          />
          <circle cx="30.01" cy="101.82" r="2.2" style="fill:#212121;" />
          <path
            d="M30.01,103.42l-10.18,15.44c-0.26,0.37-0.16,0.64-0.81,0.6l-0.41-0.23l9.96-16.88L30.01,103.42z"
            style="fill:#212121;"
          />
          <path
            d="M43.99,74.46c-1.89,1.33-2.09,4.06-0.42,5.66l7.24,6.95c1.76,1.69,4.5,1.84,6.43,0.34 c0,0,51.65-56.02,54.22-62.65c2.5-6.47-8.53-14.03-13.72-10.66C92.63,17.42,43.99,74.46,43.99,74.46z"
            style="fill:#795548;"
          />
          <path
            d="M70.7,65.39l-0.67-0.6c-0.45-0.4-0.49-1.1-0.09-1.55l25.19-28.15c0.4-0.45,1.1-0.49,1.55-0.09 l0.67,0.6c0.45,0.4,0.49,1.1,0.09,1.55L72.25,65.31C71.85,65.76,71.15,65.79,70.7,65.39z"
            style="fill:#BCAAA4;"
          />
        </g>
        <path
          d="M57.53,86.17L45.16,74.9c-0.89-0.81-0.96-2.2-0.14-3.09l0,0c0.81-0.89,2.2-0.96,3.09-0.14 l12.37,11.27c0.89,0.81,0.96,2.2,0.14,3.09l0,0C59.81,86.92,58.42,86.98,57.53,86.17z"
          style="fill:#BCAAA4;"
        />
      </g>
    </svg>
    <svg
      id="marker"
      class="hidden"
      on:click={markerDrawingTool}
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="128"
      height="128"
      style="enable-background:new 0 0 128 128; transform: scale(0.25);"
    >
      <rect
        height="128.51"
        style="fill:#E5502E;"
        transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 76.8339 151.3653)"
        width="29.73"
        x="54.9"
        y="-4.48"
      />
      <path
        d="M125.52,25.26c-1.81,1.81-7.01-5.5-11.53-10.02s-11.49-9.17-9.68-10.98 c1.81-1.81,10.56-2.23,16.97,4.19C126.78,13.95,127.33,23.45,125.52,25.26z"
        style="fill:#C63720;"
      />
      <path
        d="M125.52,25.26c-2.34,2.34-9.73-0.11-15.58-5.97S101.96,6.6,104.3,4.26 c2.34-2.34,8.99,0.45,14.85,6.31S127.86,22.92,125.52,25.26z"
        style="fill:#E5502E;"
      />
      <ellipse
        cx="24.24"
        cy="105.11"
        rx="6"
        ry="15"
        style="fill:#C63720;"
        transform="matrix(0.7071 -0.7071 0.7071 0.7071 -67.224 47.9244)"
      />
      <path
        d="M20.18,88.33c2.34-2.34,8.99,0.51,14.85,6.36c5.86,5.86,8.52,12.32,6.18,14.66l6.88-6.88l-0.29-0.29 c0.93-2.93-1.32-8.64-6.43-13.76c-5.11-5.11-11.41-7.93-14.33-7.01L20.18,88.33z"
        style="fill:#2F2F2F;"
      />
      <path
        d="M91.6,16.91c2.3-2.3,8.8,0.32,14.66,6.18c5.86,5.86,8.71,12.51,6.36,14.85l6.88-6.88l-0.29-0.29 c0.93-2.93-1.89-8.64-7.01-13.76c-5.11-5.11-10.83-7.93-13.76-7.01L91.6,16.91z"
        style="fill:#2F2F2F;"
      />
      <path
        d="M30.6,114.99c-1.81,1.81-6.94-0.25-11.47-4.78s-6.61-9.66-4.8-11.47c1.81-1.81,6.83,0.39,11.36,4.92 C30.21,108.19,32.41,113.18,30.6,114.99z"
        style="fill:#E5502E;"
      />
      <polygon
        points="9.53,125.81 30.91,114.67 14.66,98.41 3.53,119.81 "
        style="fill:#E5502E;"
      />
      <ellipse
        cx="6.6"
        cy="122.75"
        rx="1.79"
        ry="4.47"
        style="fill:#C63720;"
        transform="matrix(0.7071 -0.7071 0.7071 0.7071 -84.8605 40.6191)"
      />
      <g>
        <defs>
          <rect
            id="SVGID_1_"
            height="30"
            transform="matrix(0.7071 -0.7071 0.7071 0.7071 -22.3364 66.4806)"
            width="129"
            x="4.58"
            y="45.2"
          />
        </defs>
        <clipPath id="SVGID_2_">
          <use style="overflow:visible;" xlink:href="#SVGID_1_" />
        </clipPath>
        <ellipse
          cx="81.76"
          cy="68.99"
          rx="30.7"
          ry="7.15"
          style="clip-path:url(#SVGID_2_);fill:#2F2F2F;"
          transform="matrix(0.708 -0.7062 0.7062 0.708 -24.8463 77.8822)"
        />
      </g>
    </svg>
    <svg
      id="highlight"
      class="hidden"
      on:click={highlightDrawingTool}
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="128"
      height="128"
      style="enable-background:new 0 0 128 128; transform: scale(0.25);"
    >
      <g>
        <defs>
          <path
            id="SVGID_1_"
            d="M40.97,80.92c-6.3-1.36-13.54,0.35-18.58,4.98c-5.24,4.79-6.36,11.91-7.7,18.53 c-0.74,3.6-1.02,8.75-4.15,11.21c-1.41,1.11-2.71,1.17-4.35,1.09c-0.64-0.03-3.62-1.05-2.77,0.91c1.61,3.74,9.63,6.01,13.1,6.79 c9.33,2.08,19.33-0.46,26.76-6.41c0.77-0.63,1.52-1.29,2.23-1.98c5.74-5.57,10.04-14.12,8.4-22.22 C52.43,86.5,47.14,82.25,40.97,80.92z"
          />
        </defs>
        <use style="overflow:visible;fill:#855C52;" xlink:href="#SVGID_1_" />
        <clipPath id="SVGID_2_">
          <use style="overflow:visible;" xlink:href="#SVGID_1_" />
        </clipPath>
        <path
          d="M28,97.84c0.09,0.33,0.14,0.73,0.12,1.24c-0.13,3.05,2.03,4.11,4.74,4.59 c2.75,0.48,6.28,0.48,5.63,4.16c-0.29,1.58-1.25,2.62,0.17,3.86c2.13,1.87,6.75,2.33,9.33,1.22c1.59-0.69,3.75-1.18,2.38,1.33 c-0.79,1.45-2.07,2.69-3.08,4.01c-1.11,1.44-2.38,2.53-3.85,3.59c-1.08,0.79-1.9,1.79-3.1,2.42c-3.06,1.57-6.68,1.59-10.01,2.07 c-4.46,0.64-8.92,2.39-13.21,0.33c-4.54-2.18-9.85-2.55-14.28-4.93c-2.18-1.17-3.38-2.84-2.59-5.27c0.68-2.09,2.3-2.63,4.33-2.72 c2.29-0.1,4.2-0.38,5.61-2.4c1.21-1.72,1.08-4.55,1.3-6.54c0.29-2.72,0.5-5.63,1.65-8.15c0.96-2.08,1.99-4.15,3.29-6.05 c0.61-0.89,1.28-1.99,2.13-2.67c1.32-1.06,2.76-1.4,4.35-1.8c0.26,1.28-1.07,2.99-1.45,4.17c-0.65,2.02-0.98,4.25,0.98,5.46 C24.33,96.92,27.37,95.58,28,97.84z"
          style="clip-path:url(#SVGID_2_);fill:#ED6C30;"
        />
      </g>
      <path
        d="M64.07,56.13c8.55-6.93,21.61-22.09,29.56-29.73c4.88-4.68,9.5-9.72,14.13-14.6 c2.93-3.09,7.35-8.65,12.25-7.69c0.85,0.17,1.56,0.66,2.16,1.27c1.33,1.35,0.86,3.93,0.08,5.46c-3.12,6.11-7.95,11.64-12.13,17.06 c-1.6,2.08-3.2,4.14-4.87,6.17c-4.86,5.94-15.97,18.07-20.57,24.22c-1.79,2.4-3.51,4.84-5.13,7.35c-1.01,1.55-2.36,2.79-3.11,4.48 c-0.76,1.72-3.96-4.07-4.13-4.51c-0.65-1.71-1.36-2.67-2.92-3.52c-1.12-0.6-7.35-2.63-6.48-4.57C63.13,57,63.56,56.54,64.07,56.13z"
        style="fill:#196CA2;"
      />
      <g>
        <defs>
          <path
            id="SVGID_3_"
            d="M75.68,68.17C74.47,65.6,72.83,63.61,71,62c-0.47-0.42-0.94-0.82-1.36-1.24c-2.84-2.79-5.53-3.82-7.95-3.14 c-3.63,1.02-4.71,2.61-7.22,5.68c-0.68,0.84-1.31,1.61-1.88,2.23c-4.58,4.97-4.74,4.6-11.61,7.66l-0.58,0.24 c-1.55,0.65-3.67,1.54-4.21,3.73c-0.23,0.94-0.21,2.4,1.19,4.07c1.53,1.83,3.34,3.1,5.08,4.33c0.63,0.44,1.25,0.88,1.86,1.35 c1.99,1.53,3.72,3.41,5.55,5.39l1.08,1.17c0.29,0.3,0.55,0.68,0.85,1.06c0.82,1.09,1.83,2.45,3.33,3.17 c0.52,0.25,0.97,0.4,1.41,0.48c1.7,0.3,2.75-0.6,3.3-1.09l0.23-0.19c2.21-1.83,3.94-5.39,4.92-7.9c0.62-1.6,0.57-2,1-3 c1.15-2.63,2.99-4.61,4-6c2-2.75,2.81-3.78,3.58-4.48C75.85,73.42,77,71,75.68,68.17z"
          />
        </defs>
        <use style="overflow:visible;fill:#C7E4EA;" xlink:href="#SVGID_3_" />
        <clipPath id="SVGID_4_">
          <use style="overflow:visible;" xlink:href="#SVGID_3_" />
        </clipPath>
        <path
          d="M63.99,98.16c-0.9-0.16-1.71-0.75-2.12-1.65 c-0.49-1.11-0.72-2.15-0.93-3.09c-0.19-0.84-0.34-1.57-0.67-2.18c-2.98-5.64-7.05-9.9-14.03-14.7c-2.09-1.44-4.06-2.32-5.82-2.63 c-1.56-0.27-2.61-1.76-2.33-3.32c0.27-1.56,1.76-2.6,3.33-2.33c2.57,0.45,5.29,1.65,8.07,3.55c5.44,3.74,11.59,8.66,15.87,16.76 c0.68,1.3,0.96,2.54,1.19,3.63c0.17,0.75,0.31,1.4,0.57,1.97c0.65,1.44,0,3.14-1.44,3.79C65.11,98.2,64.54,98.26,63.99,98.16z"
          style="clip-path:url(#SVGID_4_);fill:#78A3AD;"
        />
      </g>
    </svg>
    <svg
      id="text"
      class="hidden"
      on:click={textAnnotationTool}
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="128"
      height="128"
      style="enable-background:new 0 0 128 128; transform: scale(0.25);"
    >
      <path
        d="M128,87.1c0,3.5-2.84,6.34-6.34,6.34H8.75c-3.5,0-6.34-2.84-6.34-6.34V39.83 c0-3.5,2.84-6.34,6.34-6.34h112.9c3.5,0,6.34,2.84,6.34,6.34V87.1z"
        style="fill:#64878E;"
      />
      <path
        d="M125.46,84.67c0,3.5-2.84,6.34-6.34,6.34H6.21c-3.5,0-6.34-2.84-6.34-6.34V37.4 c0-3.5,2.84-6.34,6.34-6.34h112.9c3.5,0,6.34,2.84,6.34,6.34V84.67z"
        style="fill:#78A3AD;"
      />
      <g>
        <g>
          <path
            d="M16.72,55.88c0,1.08-0.88,1.96-1.96,1.96H8.89c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V55.88z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M29.63,55.88c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V55.88z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M42.53,55.88c0,1.08-0.88,1.96-1.96,1.96H34.7c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V55.88z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M55.43,55.88c0,1.08-0.88,1.96-1.96,1.96H47.6c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V55.88z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M68.34,55.88c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V55.88z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M81.24,55.88c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V55.88z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M94.15,55.88c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V55.88z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M107.05,55.88c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V55.88z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M119.95,55.88c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96H118c1.08,0,1.96,0.88,1.96,1.96V55.88z"
            style="fill:#7C7D7D;"
          />
        </g>
        <g>
          <path
            d="M16.72,69.65c0,1.08-0.88,1.96-1.96,1.96H8.89c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V69.65z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M29.63,69.65c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V69.65z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M42.53,69.65c0,1.08-0.88,1.96-1.96,1.96H34.7c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V69.65z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M55.43,69.65c0,1.08-0.88,1.96-1.96,1.96H47.6c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V69.65z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M68.34,69.65c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V69.65z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M81.24,69.65c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V69.65z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M94.15,69.65c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V69.65z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M119.95,69.65c0,1.08-0.88,1.96-1.96,1.96H99.22c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96H118c1.08,0,1.96,0.88,1.96,1.96V69.65z"
            style="fill:#7C7D7D;"
          />
        </g>
        <g>
          <path
            d="M16.72,83.43c0,1.08-0.88,1.96-1.96,1.96H8.89c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V83.43z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M29.63,83.43c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V83.43z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M94.15,83.43c0,1.08-0.88,1.96-1.96,1.96H34.7c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h57.49c1.08,0,1.96,0.88,1.96,1.96V83.43z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M107.05,83.43c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V83.43z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M119.95,83.43c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96H118c1.08,0,1.96,0.88,1.96,1.96V83.43z"
            style="fill:#7C7D7D;"
          />
        </g>
        <g>
          <path
            d="M16.72,42.17c0,1.08-0.88,1.96-1.96,1.96H8.89c-1.08,0-1.96-0.88-1.96-1.96v-1.96 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V42.17z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M29.63,42.17c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-1.96 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V42.17z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M42.53,42.17c0,1.08-0.88,1.96-1.96,1.96H34.7c-1.08,0-1.96-0.88-1.96-1.96v-1.96 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V42.17z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M55.43,42.17c0,1.08-0.88,1.96-1.96,1.96H47.6c-1.08,0-1.96-0.88-1.96-1.96v-1.96 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V42.17z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M68.34,42.17c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-1.96 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V42.17z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M81.24,42.17c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-1.96 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V42.17z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M94.15,42.17c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-1.96 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V42.17z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M107.05,42.17c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-1.96 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V42.17z"
            style="fill:#7C7D7D;"
          />
          <path
            d="M119.95,42.17c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-1.96 c0-1.08,0.88-1.96,1.96-1.96H118c1.08,0,1.96,0.88,1.96,1.96V42.17z"
            style="fill:#7C7D7D;"
          />
        </g>
      </g>
      <g>
        <g>
          <path
            d="M15.94,55.1c0,1.08-0.88,1.96-1.96,1.96H8.11c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V55.1z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M28.84,55.1c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V55.1z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M41.75,55.1c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V55.1z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M54.65,55.1c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V55.1z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M67.56,55.1c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V55.1z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M80.46,55.1c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V55.1z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M93.36,55.1c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V55.1z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M106.27,55.1c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V55.1z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M119.17,55.1c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V55.1z"
            style="fill:#FFFFFF;"
          />
        </g>
        <g>
          <path
            d="M15.94,68.87c0,1.08-0.88,1.96-1.96,1.96H8.11c-1.08,0-1.96-0.88-1.96-1.96V63 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V68.87z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M28.84,68.87c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96V63 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V68.87z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M41.75,68.87c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96V63 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V68.87z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M54.65,68.87c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96V63 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V68.87z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M67.56,68.87c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96V63 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V68.87z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M80.46,68.87c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96V63 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V68.87z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M93.36,68.87c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96V63 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V68.87z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M119.17,68.87c0,1.08-0.88,1.96-1.96,1.96H98.44c-1.08,0-1.96-0.88-1.96-1.96V63 c0-1.08,0.88-1.96,1.96-1.96h18.78c1.08,0,1.96,0.88,1.96,1.96V68.87z"
            style="fill:#FFFFFF;"
          />
        </g>
        <g>
          <path
            d="M15.94,82.65c0,1.08-0.88,1.96-1.96,1.96H8.11c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V82.65z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M28.84,82.65c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V82.65z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M93.36,82.65c0,1.08-0.88,1.96-1.96,1.96H33.92c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h57.49c1.08,0,1.96,0.88,1.96,1.96V82.65z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M106.27,82.65c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V82.65z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M119.17,82.65c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-5.87 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V82.65z"
            style="fill:#FFFFFF;"
          />
        </g>
        <g>
          <path
            d="M15.94,41.39c0,1.08-0.88,1.96-1.96,1.96H8.11c-1.08,0-1.96-0.88-1.96-1.96v-1.96 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V41.39z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M28.84,41.39c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-1.96 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V41.39z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M41.75,41.39c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-1.96 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V41.39z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M54.65,41.39c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-1.96 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V41.39z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M67.56,41.39c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-1.96 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V41.39z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M80.46,41.39c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-1.96 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V41.39z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M93.36,41.39c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-1.96 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V41.39z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M106.27,41.39c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-1.96 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V41.39z"
            style="fill:#FFFFFF;"
          />
          <path
            d="M119.17,41.39c0,1.08-0.88,1.96-1.96,1.96h-5.87c-1.08,0-1.96-0.88-1.96-1.96v-1.96 c0-1.08,0.88-1.96,1.96-1.96h5.87c1.08,0,1.96,0.88,1.96,1.96V41.39z"
            style="fill:#FFFFFF;"
          />
        </g>
      </g>
    </svg>
  </div>
  <Card
    class="text-center"
    style="padding: 1rem; background: url('../bugs_bunny.png') left bottom no-repeat; background-size: 35%; border: inset 10px transparent;"
  >
    <CardTitle
      style="font-family: 'Bangers', cursive; font-size: xx-large; color: #46908b; margin-top: 0; text-align: left;"
      >Bugs Bunny</CardTitle
    >
    <CardBody style="opacity: 0.85;">
      <Alert
        color="success"
        isOpen={reportSubmitted}
        toggle={() => (reportSubmitted = false)}
      >
        Sent! Thank you for improving the app! Have a good day {":)"}
      </Alert>

      <FormGroup style="margin-left: 40%;">
        <Input
          id="title"
          label="Descriptive Title"
          style="height: 2em; background-color: #f5f5f5; margin-bottom: 1em;"
          placeholder="Enter a descriptive title"
          bind:value={title}
        />
        <Input
          id="additionalContext"
          type="textarea"
          label="Give additional context"
          style="height: 300px; background-color: #f5f5f5;"
          placeholder="Give context to help the team understand the request"
          bind:value={reportText}
        />
        <Input
          id="files"
          type="file"
          label="Attach files"
          style="background-color: #f5f5f5; margin-top: 1em;"
          on:change={(e)=>onFileSelected(e)}
          bind:this={fileInput}
        />
        <Tooltip target="additionalContext" placement="top"
          >Is there any more context to be provided?</Tooltip
        >
      </FormGroup>
    </CardBody>

    <Container style="margin-left: 20%;">
      <button class="save-button" on:click={() => submitRequest("bug")} disabled={reportSubmitted || !reportText}>Submit as bug</button>
      <button class="save-button" on:click={() => submitRequest("idea")} disabled={reportSubmitted || !reportText}>Submit as idea</button>
      <button class="" on:click={capturePipeline}>Take Screenshot</button>
    </Container>
  </Card>
</main>