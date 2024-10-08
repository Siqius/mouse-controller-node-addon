const addon = await import('module').then(m => m.createRequire(import.meta.url)('./build/Release/mouse-controller.node'));
import { start } from "node:repl";
import { workerData, parentPort } from "node:worker_threads";

async function sendInput(obj) {
  const repeat = obj.repeat;
  const macro = obj.macro;
  const startDelay = obj.startDelay;
  addon.sleep(JSON.stringify({
    "startDelay": startDelay
  }))
  for(let i = 0; i != repeat; i++) {
    for(const input of macro) {
      let delay = parseInt(input.delay) >= 5 ? input.delay : "5";
      let clickParams = {
        "button": input.button,
        "type": input.type,
        "delay": delay,
        "duration": input.duration,
        "steps": input.steps,
        "move": input.move,
        "x": input.x,
        "y": input.y
      }
      if(input.inputType == "mouse") {
        addon.click(JSON.stringify(clickParams));
      }else if(input.inputType == "keyboard") {
        addon.keyPress(JSON.stringify(clickParams));
      }else if(input.inputType == "write") {
        addon.write(JSON.stringify(clickParams));
      }else if(input.inputType == "move") {
        addon.moveMouse(JSON.stringify(clickParams));
      }
    };
  }
}

sendInput(workerData);
