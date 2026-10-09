const makeQuestions = (entries) =>
  Object.fromEntries(
    Object.entries(entries).map(([suspectId, items]) => [
      suspectId,
      items.map(([question, answer]) => ({ question, answer })),
    ])
  );

export const cases = {
  "1": {
    id: 1,
    title: "The Missing Prototype",
    description:
      "A new invention has disappeared from a research lab just before its big demonstration. Three people had access to the lab. Find out who took it and why.",

    suspects: [
      { id: "ahmed", name: "Ahmed Khan", role: "Lead Engineer" },
      { id: "hamza", name: "Hamza Malik", role: "Security Officer" },
      { id: "sarah", name: "Sarah Ali", role: "Research Assistant" },
    ],

    variations: [
      {
        culprit: "ahmed",
        evidence: [
          {
            id: "lab-log",
            name: "Lab Door Record",
            description:
              "The lab door was opened at 6:42 PM using an authorized access card. The record shows when the door opened, but not who carried the prototype away.",
          },
          {
            id: "prototype-case",
            name: "Empty Prototype Case",
            description:
              "The case was found open, and the foam inside still had the shape of the missing prototype. It looks like someone removed it recently.",
          },
          {
            id: "maintenance-note",
            name: "Calibration Note",
            description:
              "Ahmed worked on the prototype earlier that afternoon. His notes show that he knew how to handle and remove it safely.",
          },
          {
            id: "demo-schedule",
            name: "New Demo Schedule",
            description:
              "The demonstration was moved 30 minutes earlier. Ahmed had seen the new schedule and knew the prototype was needed soon.",
          },
        ],
        questions: makeQuestions({
          ahmed: [
            [
              "When did you last see the prototype?",
              "I checked it earlier that afternoon. I didn't see what happened after I finished my work.",
            ],
            [
              "Did you know the demonstration time had changed?",
              "Yes, the team received the new schedule. Everyone knew we had less time to prepare.",
            ],
          ],
          hamza: [
            [
              "What does the door record tell us?",
              "It tells us when someone opened the lab door. It doesn't tell us who took the prototype.",
            ],
            [
              "Was the lab secure?",
              "Only authorized people could enter. But I couldn't watch every person inside the lab all the time.",
            ],
          ],
          sarah: [
            [
              "What were you doing before the demonstration?",
              "I was preparing the research materials. I was busy getting everything ready for the new schedule.",
            ],
            [
              "Did you notice anything strange?",
              "The new demonstration time made everyone rush. I can't say if that had anything to do with the missing prototype.",
            ],
          ],
        }),
        solution:
          "Ahmed took the prototype because he knew how to handle it and had worked on it earlier that day. The lab door record gives investigators a time to check, while the calibration note connects Ahmed to the prototype. These clues must be considered together.",
      },

      {
        culprit: "hamza",
        evidence: [
          {
            id: "guard-log",
            name: "Security Patrol Log",
            description:
              "Hamza's patrol log has a gap around the time the prototype disappeared. He has not explained where he was during that period.",
          },
          {
            id: "lab-door",
            name: "Lab Door Record",
            description:
              "The lab door was opened shortly before the disappearance was reported. Only people with authorized access could enter.",
          },
          {
            id: "camera-report",
            name: "Camera Maintenance Report",
            description:
              "The camera near the lab stopped recording briefly that evening for a maintenance check. Anyone passing during that time may not have been recorded.",
          },
          {
            id: "key-register",
            name: "Temporary Key Register",
            description:
              "A temporary key was taken during Hamza's shift, but the register does not show when it was returned. The missing return time needs an explanation.",
          },
        ],
        questions: makeQuestions({
          ahmed: [
            [
              "Could someone take the prototype without your help?",
              "Possibly, but they would need access to the lab. The door and key records might help identify who could enter.",
            ],
            [
              "Did you change anything before the demonstration?",
              "I checked the prototype's calibration earlier. My work is recorded in the lab notes.",
            ],
          ],
          hamza: [
            [
              "Why is there a gap in your patrol log?",
              "I can't explain the gap just by looking at the log. My other shift records should help clear that up.",
            ],
            [
              "Who took the temporary key?",
              "The register should show who signed it out. I agree that the missing return time needs to be checked.",
            ],
          ],
          sarah: [
            [
              "Why was the camera not recording?",
              "I saw the maintenance notice, but I don't know who was near the camera at that time.",
            ],
            [
              "Who could enter the lab?",
              "Several staff members had permission to enter. The access records should help narrow it down.",
            ],
          ],
        }),
        solution:
          "Hamza used his security duties to create an opportunity to take the prototype. The gap in his patrol log, the camera interruption, and the missing key return time all raise questions about his actions. Together, these clues point toward Hamza.",
      },

      {
        culprit: "sarah",
        evidence: [
          {
            id: "research-checklist",
            name: "Preparation Checklist",
            description:
              "Sarah checked off several tasks while preparing for the demonstration. One task has no time written beside it, so investigators cannot tell exactly when she completed it.",
          },
          {
            id: "storage-record",
            name: "Storage Record",
            description:
              "The record shows that the prototype was in its case earlier that day. During the next check, the case was empty.",
          },
          {
            id: "corridor-witness",
            name: "Witness Statement",
            description:
              "A staff member saw someone carrying a covered container near the lab. The person was not clearly identified, and the witness could not see what was inside.",
          },
          {
            id: "schedule-copy",
            name: "Printed Demo Schedule",
            description:
              "A copy of the new demonstration schedule was found with Sarah's preparation materials. It shows that she knew the updated time.",
          },
        ],
        questions: makeQuestions({
          ahmed: [
            [
              "Who prepared the demonstration materials?",
              "We shared the work. The checklist should help show who handled each task.",
            ],
            [
              "Could someone move the prototype during preparation?",
              "It could have been moved while people were working. We need to check who handled the materials and when.",
            ],
          ],
          hamza: [
            [
              "Did anyone report carrying a container?",
              "One staff member mentioned a covered container. They couldn't identify the person or say what was inside.",
            ],
            [
              "Can the door records identify the person?",
              "They can show when the lab was entered, but they may not prove who carried something out.",
            ],
          ],
          sarah: [
            [
              "Why is a task missing its time?",
              "I didn't write down the exact time for every task. The checklist shows what I completed, even if some times are missing.",
            ],
            [
              "Did you handle the demonstration materials?",
              "Yes, that was part of my job. I helped prepare the materials before the demonstration.",
            ],
          ],
        }),
        solution:
          "Sarah used her preparation duties as a chance to remove the prototype. The incomplete checklist leaves a gap in her timeline, while the witness statement describes someone carrying a covered container near the lab. These clues, along with the storage record, point toward Sarah.",
      },
    ],
  },

  "2": {
    id: 2,
    title: "The Locked Room",
    description:
      "A valuable art collection has vanished from a room that was supposed to be locked from the inside. There are no clear signs of a break-in. Investigate the room and discover how the collection disappeared.",

    suspects: [
      { id: "daniel", name: "Daniel Reed", role: "Building Manager" },
      { id: "mariam", name: "Mariam Shah", role: "Art Conservator" },
      { id: "bilal", name: "Bilal Ahmed", role: "Night Guard" },
    ],

    variations: [
      {
        culprit: "daniel",
        evidence: [
          {
            id: "room-plan",
            name: "Building Floor Plan",
            description:
              "The plan shows the gallery and a service corridor used by maintenance staff. Daniel, the building manager, knows how these areas connect.",
          },
          {
            id: "lock-report",
            name: "Lock Inspection Report",
            description:
              "The main door lock was working properly when it was checked. However, this does not prove that nobody used another route into or out of the room.",
          },
          {
            id: "service-register",
            name: "Service Access Register",
            description:
              "The register shows that the service area was accessed that evening. Daniel's name appears beside the entry, but no reason was written down.",
          },
          {
            id: "collection-list",
            name: "Collection Inventory",
            description:
              "The collection was counted before the room was locked. When staff checked again the next morning, it was missing.",
          },
        ],
        questions: makeQuestions({
          daniel: [
            [
              "Who knows the service areas?",
              "The maintenance team and I know the building layout. That doesn't mean I know who used the service areas that night.",
            ],
            [
              "Was the room checked before it was locked?",
              "The main lock was checked. I can't say that every possible entrance was checked at the same time.",
            ],
          ],
          mariam: [
            [
              "When did you last see the collection?",
              "I saw it during my conservation work. The inventory should show when it was last confirmed to be there.",
            ],
            [
              "Would moving the collection be difficult?",
              "Yes, it needs careful handling. Anyone moving it would need to know how to protect the artwork.",
            ],
          ],
          bilal: [
            [
              "Did you patrol the gallery that night?",
              "My patrol log should show which checks I completed. We need to look at the times to see what happened.",
            ],
            [
              "Did you see anyone near the service corridor?",
              "I can't remember seeing anyone unusual. The service register might help us check who had access.",
            ],
          ],
        }),
        solution:
          "Daniel used his knowledge of the building's service areas to remove the collection without using the main door. His name appears in the service access register, and the floor plan shows a possible route. These clues help explain how the room could look locked even though the collection was gone.",
      },

      {
        culprit: "mariam",
        evidence: [
          {
            id: "conservation-sheet",
            name: "Conservation Work Sheet",
            description:
              "Mariam worked on the collection that day. Her work sheet has no final signature, so it is unclear exactly when she finished handling the artwork.",
          },
          {
            id: "display-photo",
            name: "Gallery Photograph",
            description:
              "A photograph shows the collection on display earlier that day. It proves the artwork was there at that time, but not when it was last seen.",
          },
          {
            id: "equipment-log",
            name: "Equipment Register",
            description:
              "Special equipment used to move artwork was taken during the evening shift. The register does not show that it was returned.",
          },
          {
            id: "room-seal",
            name: "Room Lock Record",
            description:
              "The main door was recorded as locked. The record does not say whether anyone used another entrance or handled the collection before the room was secured.",
          },
        ],
        questions: makeQuestions({
          daniel: [
            [
              "Who was allowed to handle the collection?",
              "Mariam and other approved staff could handle it for conservation work. The work sheet should show who did what.",
            ],
            [
              "Was the room locked?",
              "The record says the main door was locked. It doesn't tell us what happened before that or whether another route was used.",
            ],
          ],
          mariam: [
            [
              "Why is your work sheet incomplete?",
              "The final entry wasn't completed. I understand that it needs to be checked against the work schedule.",
            ],
            [
              "What equipment did you take?",
              "The register lists the equipment taken during the shift. We should check the return record to see where it went.",
            ],
          ],
          bilal: [
            [
              "Did you see the collection during your shift?",
              "My patrol notes should show which areas I checked. We also need the inventory to know when the collection was last seen.",
            ],
            [
              "Could someone enter after the door was locked?",
              "I can only confirm what the main door record says. We would need to check the other access records too.",
            ],
          ],
        }),
        solution:
          "Mariam used her conservation work as an opportunity to remove the collection. She knew how to handle the artwork, and the equipment register shows that specialist equipment was taken but not recorded as returned. Her unfinished work sheet adds uncertainty about when she left. Together, these clues point toward Mariam.",
      },

      {
        culprit: "bilal",
        evidence: [
          {
            id: "night-roster",
            name: "Night Shift Roster",
            description:
              "The roster shows that Bilal was responsible for security that night. It lists when he was supposed to patrol the gallery.",
          },
          {
            id: "patrol-clock",
            name: "Missing Patrol Scan",
            description:
              "One of Bilal's expected patrol scans is missing. This means there is a period when the records cannot confirm that he checked the area.",
          },
          {
            id: "door-status",
            name: "Door Status Report",
            description:
              "The main door was recorded as locked during the night. This does not tell us whether another route was used.",
          },
          {
            id: "incident-form",
            name: "Missing Collection Report",
            description:
              "The collection was reported missing during the morning inspection. Nobody knows the exact time it disappeared, so the night shift is important to the investigation.",
          },
        ],
        questions: makeQuestions({
          daniel: [
            [
              "Who was responsible for security that night?",
              "Bilal was the assigned guard. His patrol records should show which checks he completed.",
            ],
            [
              "Was the main door locked?",
              "Yes, the report says it was locked. But that alone doesn't explain how the collection disappeared.",
            ],
          ],
          mariam: [
            [
              "When was the collection last seen?",
              "The inventory and my work notes should help establish when it was last confirmed to be there.",
            ],
            [
              "Does the missing patrol scan matter?",
              "It could matter because it leaves a gap in the timeline. But we need other clues before blaming anyone.",
            ],
          ],
          bilal: [
            [
              "Why is one of your patrol scans missing?",
              "I know the scan is missing, but the record doesn't explain why. My shift notes should be checked.",
            ],
            [
              "Did you notice anything unusual?",
              "I don't remember anything unusual. The patrol records should help us work out what happened during the night.",
            ],
          ],
        }),
        solution:
          "Bilal used his night guard duties to create an opportunity to remove the collection. The missing patrol scan leaves a gap in the security timeline, and the collection disappeared sometime during the night. The patrol record and his responsibility for the gallery make him the main suspect.",
      },
    ],
  },

  "3": {
    id: 3,
    title: "The Silent Witness",
    description:
      "A witness in a company investigation suddenly stops answering questions. Around the same time, an important document disappears. Find out who removed the document and why the witness went quiet.",

    suspects: [
      { id: "usman", name: "Usman Tariq", role: "Corporate Lawyer" },
      { id: "ayesha", name: "Ayesha Noor", role: "Office Administrator" },
      { id: "farhan", name: "Farhan Qureshi", role: "IT Specialist" },
    ],

    variations: [
      {
        culprit: "usman",
        evidence: [
          {
            id: "case-memo",
            name: "Confidential Case Memo",
            description:
              "The memo contains information that could affect an ongoing company dispute. Usman was involved in handling the case, and the list of people who received the memo is incomplete.",
          },
          {
            id: "meeting-calendar",
            name: "Private Meeting Schedule",
            description:
              "Usman had a private meeting shortly before the document disappeared. The calendar shows the meeting time but not what was discussed.",
          },
          {
            id: "witness-email",
            name: "Witness Email",
            description:
              "The witness asked to speak privately about the investigation. After that, the witness stopped replying to normal follow-up emails.",
          },
          {
            id: "document-register",
            name: "Document Register",
            description:
              "The important document was listed in the register earlier that day. Its next location was never recorded.",
          },
        ],
        questions: makeQuestions({
          usman: [
            [
              "What was in the confidential memo?",
              "It was about the company case. I can't discuss every detail without checking the case records.",
            ],
            [
              "Did you meet with the witness?",
              "There were meetings related to the investigation. The calendar shows the schedule, but it doesn't explain every conversation.",
            ],
          ],
          ayesha: [
            [
              "Who could update the document register?",
              "The office team used the register to track documents. Its history should show which account made any changes.",
            ],
            [
              "Why did the witness stop replying?",
              "I noticed the follow-up emails, but I don't know why the witness stopped answering.",
            ],
          ],
          farhan: [
            [
              "Could the document have disappeared from the computer?",
              "If it was stored digitally, the system records might show what happened. We need to check whether a digital copy existed.",
            ],
            [
              "Were there computer problems that day?",
              "The system records should show any problems. We need to check whether they are connected to the missing document.",
            ],
          ],
        }),
        solution:
          "Usman wanted to keep the document hidden because its contents could harm the company case he was handling. His private meeting took place shortly before the document disappeared, and the witness later stopped replying. These clues raise questions about whether Usman influenced the witness and arranged for the document to go missing.",
      },

      {
        culprit: "ayesha",
        evidence: [
          {
            id: "filing-index",
            name: "Office Filing Index",
            description:
              "The index shows where important documents should be kept. A later entry points to a location where the missing document cannot be found.",
          },
          {
            id: "visitor-register",
            name: "Visitor Register",
            description:
              "A visitor signed in around the time the document was last seen. The register does not say which files the visitor saw.",
          },
          {
            id: "witness-message",
            name: "Witness Message",
            description:
              "The witness asked whether an earlier statement had been filed correctly. Nobody recorded a reply to the message.",
          },
          {
            id: "archive-list",
            name: "Archive Transfer List",
            description:
              "Several documents were moved to the archive that day. One item has no confirmation showing that it reached its final location.",
          },
        ],
        questions: makeQuestions({
          usman: [
            [
              "Was the missing document important?",
              "It was part of the company investigation. We need to find it before we can understand its full importance.",
            ],
            [
              "Did you tell the witness to stay quiet?",
              "No such instruction is recorded in the documents I've seen. Any messages between us should be checked.",
            ],
          ],
          ayesha: [
            [
              "Who changed the filing index?",
              "The index was part of my office duties, but the change history should show when and how it was updated.",
            ],
            [
              "Where did the missing document go?",
              "The archive list shows where documents were supposed to go. One entry is incomplete, so I can't confirm the final location from that list alone.",
            ],
          ],
          farhan: [
            [
              "Can the computer show who opened a file?",
              "Sometimes it can show which account opened a file and when. It doesn't always prove who was using the account.",
            ],
            [
              "Could the archive list be wrong?",
              "Yes, a missing entry can cause confusion. We should compare it with the filing records and computer history.",
            ],
          ],
        }),
        solution:
          "Ayesha used her office duties to change the records and make the document difficult to find. The filing index points to the wrong location, and the archive list has no confirmation that the document arrived. These clues suggest that someone familiar with the filing system moved the document and failed to record where it went.",
      },

      {
        culprit: "farhan",
        evidence: [
          {
            id: "system-alert",
            name: "Computer System Alert",
            description:
              "The system recorded an alert shortly before the document disappeared. Farhan, the IT specialist, understands the system and knows how to investigate the alert.",
          },
          {
            id: "account-history",
            name: "Account Activity Record",
            description:
              "A company account accessed the document around the time it went missing. The record shows which account was used, but not who was sitting at the computer.",
          },
          {
            id: "backup-report",
            name: "Backup Report",
            description:
              "The system could not confirm that one backup copy was available. Investigators need to check whether another copy exists.",
          },
          {
            id: "witness-timeline",
            name: "Witness Timeline",
            description:
              "The witness's last recorded message was sent shortly before the system alert. The close timing may be important, but it does not prove the two events were connected.",
          },
        ],
        questions: makeQuestions({
          usman: [
            [
              "Was the document stored on a computer?",
              "Some investigation documents were stored digitally. The document register should tell us whether this one had a digital copy.",
            ],
            [
              "Did you ask for any changes to the system?",
              "Any official requests should appear in our case communications. Those records should be checked.",
            ],
          ],
          ayesha: [
            [
              "Who looked after the digital files?",
              "Farhan handled the technical side of the system. The office team also used it to manage documents.",
            ],
            [
              "Was the document recorded before it disappeared?",
              "Yes, the document register listed it earlier. We should compare that entry with the computer records.",
            ],
          ],
          farhan: [
            [
              "What caused the system alert?",
              "The alert shows that something happened in the system. I'd need to check the technical details before explaining it.",
            ],
            [
              "Can you confirm the document was deleted?",
              "No, the backup report doesn't prove that every copy was deleted. We need to check the other records first.",
            ],
          ],
        }),
        solution:
          "Farhan used his technical knowledge and access to make the digital document unavailable. The account record shows activity around the time it disappeared, and the system alert occurred shortly before that. The missing backup confirmation adds to the suspicion. Together, these clues point toward Farhan, although the account record alone does not prove who used the computer.",
      },
    ],
  },
};