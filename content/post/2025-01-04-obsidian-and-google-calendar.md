---
layout:      post 
draft:       false
title:      "Obsidian and Google Calendar"
subtitle:   "A Journey in Automating Meeting Chaos to Stay Sane"
description: "This post explores the Google Calendar plugin for Obsidian, focusing on how it automatically creates rich, organized notes from your calendar events. We'll dissect a powerful template that not only captures essential event details but also intelligently sorts and formats them, making your Obsidian vault a dynamic hub of information."
image_description: "Screenshot of an Obsidian note generated from a Google Calendar event using the provided template"
tags:       [obsidian, google calendar, productivity]
author:     "Thiago MadPin"
date:        2025-01-04
URL:         "/2024/12/26/obsidian-and-google-calendar/"
image:       "/img/posts/2024-12-26-obsidian-and-google-calendar.jpg"

categories:  [ Tech ]
---

Obsidian, with its vast plugin ecosystem, continually evolves to meet the diverse needs of its users. One such gem is the Google Calendar plugin, which bridges the gap between your daily schedule and your knowledge base. This post delves into the plugin's capabilities, particularly its ability to automatically generate well-structured notes from your Google Calendar events, using a powerful and customizable template.

## Bridging the Gap: Obsidian Meets Google Calendar

The Obsidian Google Calendar plugin allows you to interact with your Google Calendar directly within Obsidian. This integration provides commands to open views, insert relevant data, and create notes linked to your events. These event-linked notes are called `EventNotes`, and they can revolutionize how you manage your time and information.

> [!INFO]
> The Obsidian Google Calendar plugin requires authentication with Google to access your calendar data. This setup is outlined on the plugin's documentation page. Remember: You don't have to create the Google App on the same account as the calendar you want to access.

## Automating Your Workflow: The Power of Templates

The true potential of the Google Calendar plugin shines when combined with Obsidian's Templater plugin. Using a well-crafted template, you can automate the creation of EventNotes, pre-filled with essential information from your calendar events. This automation not only saves time but also ensures consistency and organization in your note-taking process.

### Understanding the Template

Let's break down the provided template to understand its intricacies:

#### Frontmatter: Setting the Stage

The frontmatter section defines key metadata for your EventNote:

```yaml
---
title: "{{gEvent.summary}}"
location: "{{gEvent.location}}"
MOCs:
  - "[[Events MOC]]"
tags:
  - meeting
  - Indeed
organizer: "{{gEvent.organizer.email}}"
start_time: "{{gEvent.start.dateTime}}"
created_at: <% tp.file.creation_date("YYYY-MM-DD HH:mm") %>
---
```

This section automatically populates fields like title, location, tags, organizer, and start time based on the Google Calendar event data using the `gEvent` variable. The `created_at` field is set by the Templater plugin.

#### Accessing the API: The `gEvent` Variable

The heart of the template lies in this code snippet:

```javascript
<%*
// Access the Google Calendar plugin API
const { getEvent } = this.app.plugins.plugins["google-calendar"].api;

const eventId = `{{gEvent.id}}`;
const gEvent = await getEvent(eventId);
%>
```

This JavaScript code, executed by Templater, interacts with the Google Calendar plugin's API. It retrieves the event data from Google Calendar, making it available as the `gEvent` variable throughout the template.

> [!IDEA]
> The variable `gEvent` is the key to accessing your calendar data. This simple yet powerful variable provides a wealth of information for populating your EventNotes.

#### Intelligent Sorting: The Trash Folder Logic

This section determines the destination folder for your EventNote:

```javascript
<%*
// ... (previous code)

const eventDescription = gEvent.description;
const eventStartDate = gEvent.start.date;
const eventStartDateTime = gEvent.start.dateTime;
const eventSourceURL = gEvent.source ? gEvent.source.url : "";
const formattedDate = window.moment(eventStartDate || eventStartDateTime).format('YYYY-MM-DD');
const fileName = tp.file.title;
// Get year-month from the event start date
let eventYearMonth = window.moment(eventStartDate || eventStartDateTime).format('YYYY-MM-DD').substring(0, 7);

// Base folders with event's year-month
let meetingsFolder = `/Meetings/${eventYearMonth}/`;
let trashFolder = `/Meetings/trash/${eventYearMonth}/`;

// Initialize destination with the default meetings folder
let destinationFolder = meetingsFolder;

// Determine if the meeting should go to trash
if ((eventDescription && eventDescription.includes("https://app.reclaim.ai")) ||
  (eventSourceURL && eventSourceURL.includes("reclaim.ai")) ||
    (gEvent.attendees?.length) > 50 ||
    (gEvent.attendees?.length == 1 && gEvent.attendees[0].email != gEvent.organizer?.email) ||
    !gEvent.attendees || gEvent.attendees.length === 0) {
    destinationFolder = trashFolder;
}

// ... (rest of the code)
%>
```

It uses a series of conditions to decide whether the EventNote should be placed in a regular meetings folder or a designated "trash" folder. This feature helps you manage less important or automatically generated events, keeping your main notes organized.

> [!TIP]
> Customize the conditions in this code block to fine-tune your sorting logic. For example, you could add rules based on keywords in the event title or description.

#### Dynamic File Movement: Ensuring Uniqueness

The template includes a robust mechanism for handling file naming conflicts:

```javascript
<%*
// ... (previous code)

// Try to move the file with different names
let moved = false;
let basePath = destinationFolder + formattedDate + " " + fileName;

// First try with original name
try {
  // Ensure the directory exists before moving
  await tp.file.move(basePath);
  moved = true;
} catch (error) {
    // If original name fails, try with numbers
    for (let i = 1; i <= 10; i++) {
      console.log(`Error creating the event file ${gEvent.summary} at ${gEvent.start.dateTime}: ${error}`)
        try {
          let newPath = basePath + ` (${i})`;
          await tp.file.move(newPath);
          moved = true;
          break;
        } catch (error) {
          continue;
        }
    }
}

// If all attempts failed, show an error
if (!moved) {
    new Notice("Failed to move file after 10 attempts");
}

// ... (rest of the code)
%>
```

This code attempts to move the newly created EventNote to the determined `destinationFolder`. If a file with the same name already exists, it appends a number in parentheses to ensure a unique filename. This prevents accidental overwriting of existing notes.

> [!WARNING]
> Be mindful of potential performance implications when using `tp.file.move` within a loop. While this template provides a robust solution for handling naming conflicts, consider optimizing it further if you anticipate a high volume of events or complex renaming logic.

#### Formatting the Event: Presentation Matters

The remainder of the template focuses on structuring the content of your EventNote:

```javascript
<%*
// ... (previous code)

// #
// # ---------- Title ----------
// #
tR += `# ${gEvent.summary}\n`

// #
// # ---------- Organizer ----------
// #
if (gEvent.organizer && gEvent.organizer.displayName) {
  tR += `Organizer: [${gEvent.organizer.displayName}](${gEvent.organizer.email})\n`
}
tR += `\n`
// #
// # ---------- Attendees ----------
// #
if (gEvent.attendees?.length > 0) {
    const attendeesCount = gEvent.attendees.length;
    tR += `## Attendees (${attendeesCount})\n`;
    // Sort attendees: first with names, then without
    const sortedAttendees = gEvent.attendees
        .slice(0, 30)
        .sort((a, b) => {
            if (a.displayName && !b.displayName) return -1;
            if (!a.displayName && b.displayName) return 1;
            return (a.displayName || a.email).localeCompare(b.displayName || a.email);
        });
    // Create table header
    tR += `| | | |\n`;
    tR += `|-|-|-|\n`;
    // Calculate items per column (rounded up)
    const itemsPerColumn = Math.ceil(sortedAttendees.length / 3);
    
    // Create columns
    let columns = [[], [], []];
    const statusToEmoji = { 'declined': '⛔', 'accepted': '✅', 'tentative': '🤷🏻‍♂️', 'needsAction': '' };
    // Fill columns
    sortedAttendees.forEach((attendee, index) => {
        const columnIndex = Math.floor(index / itemsPerColumn);
        const emailPrefix = attendee.email.split('@')[0];
        const name = attendee.displayName || "";
        const statusEmoji = statusToEmoji[attendee.responseStatus] || '';
        
        let attendeeLine = `${statusEmoji} [[${emailPrefix}]]`;
        if (name) {
            attendeeLine += ` - ${name}`;
        }
        
        columns[columnIndex].push(attendeeLine);
    });
    // Output table rows
    const maxRows = Math.ceil(sortedAttendees.length / 3);
    for (let row = 0; row < maxRows; row++) {
        let line = "| ";
        columns.forEach((column, index) => {
            line += (column[row] || "") + (index < 2 ? " | " : " |");
        });
        tR += `${line}\n`;
    }
    if (attendeesCount > 30) {
        tR += `\n- (more in the event)\n`;
    }
    tR += `\n`;
}
// #
// # ---------- Attachments ----------
// #
if (gEvent.attachments?.length > 0) {
  tR += "## Attachments\n"
  for (let attachment of gEvent.attachments) {
    tR += `- ![|15](${attachment.iconLink}) [${attachment.title}](${attachment.fileUrl})\n`;
  }
  tR += "\n"
}

// #
// # ---------- Description ----------
// #
// Get the raw description from the Google Event.
const rawContent = gEvent.description;
// This function now cleans up HTML tags but keeps those line breaks.
function cleanUpContent(str) {
  // First, replace <br> and <p> tags with newline characters.
  str = str.replace(/<br\s*\/?>/gi, "\n");
  str = str.replace(/<\/p>/gi, "\n\n"); // Add an extra newline for paragraph tags.
  // Then, remove all other HTML tags, leaving only the text and newline characters.
  return str.replace(/<[^>]+>/g, '');
}
if (rawContent) {
  // Clean up the raw content, preserving line breaks.
  const cleanContent = cleanUpContent(rawContent);
  // Trim the cleaned content down to 250 characters.
  const trimmedContent = cleanContent.substring(0, 250);
  // Append the cleaned, trimmed content to 'tR'.
  if (trimmedContent) {
    tR += "## Description\n"
    tR += "\n```\n"
    tR += trimmedContent;
    tR += "\n```\n"
  }  
}
%>
# Summary
```

It extracts the event title, organizer, attendees, attachments, and description, formatting them in a clear and concise manner. Notably, it presents attendees in a well-organized table, complete with emojis indicating their response status. The description is cleaned of HTML tags and trimmed for brevity.

> [!EXAMPLE]
> An event titled "Team Brainstorm" organized by "Jane Doe" with five attendees would result in an EventNote with a clear title, organizer link, and an attendee table showing each person's name (if available) and response status.

## Conclusion: Elevate Your Note-Taking

The Obsidian Google Calendar plugin, combined with this comprehensive template, empowers you to seamlessly integrate your calendar events into your Obsidian vault. By automating the creation of EventNotes, you can focus on engaging with your meetings and tasks, knowing that the essential information is captured and organized efficiently. This integration bridges the gap between your schedule and your knowledge base, transforming Obsidian into a central hub for managing your time and information. As a next step, consider exploring the plugin's other features, like using `@Annotation` to reference events in other notes, and customizing the template further to fit your specific workflow.

[Link for the whole file](https://gist.github.com/madpin/b237ec0635659a7e652e8c0577efbb6c)
