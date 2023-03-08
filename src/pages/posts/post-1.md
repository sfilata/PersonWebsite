---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'My First Blog Post'
pubDate: 2022-07-01
description: 'This is the first post of my new Astro blog.'
author: 'Astro Learner'
image:
  url: 'https://astro.build/assets/blog/astro-1-release-update/cover.jpeg'
  alt: 'The Astro logo with the word One.'
tags: ['astro', 'blogging', 'learning in public']
---

Welcome to my _new blog_ about learning Astro! Here, I will share my learning journey as I build a new website.

## What I've accomplished

1. **Installing Astro**: First, I created a new Astro project and set up my online accounts.

2. **Making Pages**: I then learned how to make pages by creating new `.astro` files and placing them in the `src/pages/` folder.

3. **Making Blog Posts**: This is my first blog post! I now have Astro pages and Markdown posts!

## What's next

I will finish the Astro tutorial, and then keep adding more posts. Watch this space for more to come.

```typescript
const variableRegex = /^([a-zA-Z_\-][a-zA-Z0-9_\-]*)/;
const outOfBandRecordRegex = /^(?:(\d*|undefined)([\*\+\=])|([\~\@\&]))/;
const asyncClassRegex = /^(.*?),/;
const resultRecordRegex = /^(\d*)\^(done|running|connected|error|exit)/;
const newlineRegex = /^\r\n?/;

class MINode {
  public outOfBandRecord;
  public resultRecords;

  constructor(public token, info, result) {
    (this.token = token), (this.outOfBandRecord = info), (this.resultRecords = result);
  }
  static valueOf(start, path) {
    if (!start) {
      return;
    }
    const pathRegex = /^\.?([a-zA-Z_\-][a-zA-Z0-9_\-]*)/,
      indexRegex = /^\[(\d+)\](?:$|\.)/;
    if (!(path = path.trim())) {
      return start;
    }
    let current = start;
    do {
      let target = pathRegex.exec(path);
      if (target) {
        if (((path = path.substr(target[0].length)), !current.length || 'string' === typeof current)) {
          return;
        }
        {
          const found = [];
          for (const element of current) {
            element[0] === target[1] && found.push(element[1]);
          }
          if (found.length > 1) {
            current = found;
          } else {
            if (1 !== found.length) {
              return;
            }
            current = found[0];
          }
        }
      } else if ('@' === path[0]) {
        (current = [current]), (path = path.substr(1));
      } else {
        if (((target = indexRegex.exec(path)), !target)) {
          return;
        }
        {
          path = path.substr(target[0].length);
          const i = parseInt(target[1]);
          if (current.length && 'string' !== typeof current && i >= 0 && i < current.length) {
            current = current[i];
          } else if (0 !== i) {
            return;
          }
        }
      }
      path = path.trim();
    } while (path);
    return current;
  }
  record(path) {
    if (this.outOfBandRecord) {
      return MINode.valueOf(this.outOfBandRecord[0].output, path);
    }
  }
  result(e) {
    if (this.resultRecords) {
      return MINode.valueOf(this.resultRecords.results, e);
    }
  }
}
const octalMatch = /^[0-7]{3}/;

const parseMI = function (output: string) {
  let token;
  const outOfBandRecord = [];
  let resultRecords;
  const asyncRecordType = { '*': 'exec', '+': 'status', '=': 'notify' },
    streamRecordType = { '~': 'console', '@': 'target', '&': 'log' },
    parseCString = () => {
      if ('"' !== output[0]) {
        return '';
      }
      let str,
        stringEnd = 1,
        inString = true,
        remaining = output.substr(1),
        escaped = false;
      for (; inString; ) {
        escaped
          ? (escaped = false)
          : '\\' === remaining[0]
          ? (escaped = true)
          : '"' === remaining[0] && (inString = false),
          (remaining = remaining.substr(1)),
          stringEnd++;
      }
      try {
        str = (function (str) {
          const ret = Buffer.alloc(4 * str.length);
          let bufIndex = 0;
          if ('"' !== str[0] || '"' !== str[str.length - 1]) {
            throw new Error('Not a valid string');
          }
          str = str.slice(1, -1);
          let unSupportFlag = false; // UnCentertain mode
          for (let i = 0; i < str.length; i++) {
            if (unSupportFlag) {
              let m;
              '\\' === str[i]
                ? (bufIndex += ret.write('\\', bufIndex))
                : '"' === str[i]
                ? (bufIndex += ret.write('"', bufIndex))
                : "'" === str[i]
                ? (bufIndex += ret.write("'", bufIndex))
                : 'n' === str[i]
                ? (bufIndex += ret.write('\n', bufIndex))
                : 'r' === str[i]
                ? (bufIndex += ret.write('\r', bufIndex))
                : 't' === str[i]
                ? (bufIndex += ret.write('\t', bufIndex))
                : 'b' === str[i]
                ? (bufIndex += ret.write('\b', bufIndex))
                : 'f' === str[i]
                ? (bufIndex += ret.write('\f', bufIndex))
                : 'v' === str[i]
                ? (bufIndex += ret.write('\v', bufIndex))
                : '0' === str[i]
                ? (bufIndex += ret.write('\0', bufIndex))
                : (m = octalMatch.exec(str.substr(i)))
                ? (ret.writeUInt8(parseInt(m[0], 8), bufIndex++), (i += 2))
                : (bufIndex += ret.write(str[i], bufIndex)),
                (unSupportFlag = false);
            } else if ('\\' === str[i]) {
              unSupportFlag = true;
            } else {
              if ('"' === str[i]) {
                throw new Error('Not a valid string');
              }
              bufIndex += ret.write(str[i], bufIndex);
            }
          }
          return ret.slice(0, bufIndex).toString('utf8');
        })(output.substr(0, stringEnd));
      } catch (s) {
        str = output.substr(0, stringEnd);
      }
      return (output = output.substr(stringEnd)), str;
    };
  let parseValue, parseCommaResult, parseCommaValue, parseResult, match;
  for (
    parseValue = () =>
      '"' === output[0]
        ? parseCString()
        : '{' === output[0] || '[' === output[0]
        ? (() => {
            if ('{' !== output[0] && '[' !== output[0]) {
              return;
            }
            const canBeValueList = '[' === output[0];
            if ('}' === (output = output.substr(1))[0] || ']' === output[0]) {
              return (output = output.substr(1)), [];
            }
            if (canBeValueList) {
              let value = parseValue();
              if (value) {
                const values = [];
                for (values.push(value); undefined !== (value = parseCommaValue()); ) {
                  values.push(value);
                }
                return (output = output.substr(1)), values;
              }
            }
            let result = parseResult();
            if (result) {
              const results = [];
              for (results.push(result); (result = parseCommaResult()); ) {
                results.push(result);
              }
              return (output = output.substr(1)), results;
            }
            output = (canBeValueList ? '[' : '{') + output;
          })()
        : undefined,
      parseResult = () => {
        const variableMatch = variableRegex.exec(output);
        if (variableMatch) {
          return (output = output.substr(variableMatch[0].length + 1)), [variableMatch[1], parseValue()];
        }
      },
      parseCommaValue = () => {
        if (',' === output[0]) {
          return (output = output.substr(1)), parseValue();
        }
      },
      parseCommaResult = () => {
        if (',' === output[0]) {
          return (output = output.substr(1)), parseResult();
        }
      };
    (match = outOfBandRecordRegex.exec(output));

  ) {
    if (
      ((output = output.substr(match[0].length)),
      match[1] && undefined === token && 'undefined' !== match[1] && (token = parseInt(match[1])),
      match[2])
    ) {
      const classMatch = asyncClassRegex.exec(output);
      output = output.substr(classMatch[1].length);
      const asyncRecord = {
        isStream: false,
        type: asyncRecordType[match[2]],
        asyncClass: classMatch[1],
        output: []
      };
      let result;
      for (; (result = parseCommaResult()); ) {
        asyncRecord.output.push(result);
      }
      outOfBandRecord.push(asyncRecord);
    } else if (match[3]) {
      const streamRecord = { isStream: true, type: streamRecordType[match[3]], content: parseCString() };
      outOfBandRecord.push(streamRecord);
    }
    output = output.replace(newlineRegex, '');
  }
  if ((match = resultRecordRegex.exec(output))) {
    let result;
    for (
      output = output.substr(match[0].length),
        match[1] && undefined === token && (token = parseInt(match[1])),
        resultRecords = { resultClass: match[2], results: [] };
      (result = parseCommaResult());

    ) {
      resultRecords.results.push(result);
    }
    output = output.replace(newlineRegex, '');
  }
  return new MINode(token, outOfBandRecord || [], resultRecords);
};

```
