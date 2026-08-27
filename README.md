# React DOCX Editor Role-Based Editable Regions Sample

## Introduction

This repository is a runnable sample for Syncfusion React DOCX Editor. It demonstrates how a React application can:

1. Load a clean DOCX template from a self-hosted ASP.NET Core service.
2. Retrieve a demo identity and bookmark list from a mock permission API.
3. Mark matching bookmarked ranges as editable.
4. Protect the rest of the document as read-only.
5. Export a protected DOCX that retains those editing restrictions.

## Key Features

- **Role-Based Document Protection** – Dynamically apply editing restrictions based on user roles and permissions.
- **DOCX Export with Protection** – Save protected documents that retain editing restrictions.

## Prerequisites

- Node.js 20 or later
- .NET 10 SDK
- A current Chromium-based browser (Chrome or Microsoft Edge)

A Syncfusion license key is optional. Without `VITE_SYNCFUSION_LICENSE` and `SYNCFUSION_LICENSE`, the editor may show a license banner. Do not commit license keys.

## Repository layout

```text
Client-side/     React + TypeScript sample
Server-side/     ASP.NET Core Document Editor and permission API
```

## Run the sample

Start the API:

```bash
cd server
dotnet restore
dotnet run
```

The API listens on `http://localhost:5000`.

In a second terminal, start the React app:

```bash
cd client
npm ci
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` to the self-hosted service. The sample does **not** use Syncfusion's public demo service URL.

### Build and test

Frontend:

```bash
cd client
npm ci
npm run dev
npm run build
npm test -- --run
npm run lint
```

Backend:

```bash
cd server
dotnet restore
dotnet run
dotnet test
dotnet publish -c Release
```

## Demo profiles

| Profile | `currentUser` identity | Editable bookmarks |
| --- | --- | --- |
| Author | `Author` | `ExecutiveSummary`, `FinancialDetails` |
| Reviewer | `Reviewer` | `ReviewerComments` |
| Viewer | `Viewer` | none |

Changing the profile reloads the original unprotected template, fetches the new permission response, recreates editable regions, and reapplies read-only protection. The application does not edit permission ranges on an already-protected document.

## Permission contract

`GET /api/permissions?profile=Reviewer`

```json
{
  "userId": "reviewer-001",
  "identity": "Reviewer",
  "displayName": "Demo Reviewer",
  "role": "Reviewer",
  "editableBookmarks": ["ReviewerComments"],
  "issuedAtUtc": "2026-08-26T00:00:00Z"
}
```

Unknown or unauthorized profiles return zero editable bookmarks and `role: "Unknown"`. The UI treats that as view-only access.

## Architecture

The sample keeps three concerns separate:

- **Authentication/authorization** belongs to the backend. This sample only mocks a permission lookup.
- **Permission-to-bookmark mapping** is returned by `/api/permissions`.
- **Editing restrictions** are applied in the React Document Editor with `currentUser`, `selectBookmark()`, `insertEditingRegion()`, and `enforceProtection(..., "ReadOnly")`.

See [docs/architecture.md](docs/architecture.md) for the runtime flow.

## Sample document

`server/Samples/DynamicPermissionsTemplate.docx` is a redistributable template created for this sample. It contains:

- `ExecutiveSummary`
- `FinancialDetails`
- `ReviewerComments`


## Documentation

- [Restrict editing in React Document Editor](https://help.syncfusion.com/document-processing/word/word-processor/react/restrict-editing)
- [Bookmarks](https://help.syncfusion.com/document-processing/word/word-processor/react/bookmark)

## Resources

- **Product page:** [Syncfusion® React DOCX Editor](https://www.syncfusion.com/docx-editor-sdk/react-docx-editor?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples)

- **Documentation:** [Syncfusion® React DOCX Editor - Documentation](https://help.syncfusion.com/document-processing/word/word-processor/react/overview?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples)

- **Online demo:** [Syncfusion® React DOCX Editor - Online demo](https://document.syncfusion.com/demos/docx-editor/react/#/tailwind3/document-editor/default?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples)

## Support and feedback

For any other queries, reach our [Syncfusion® support team](https://support.syncfusion.com/?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples) or post the queries through the [community forums](https://www.syncfusion.com/forums?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples).

Request new feature through [Syncfusion® feedback portal](https://www.syncfusion.com/feedback?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples).

## License

This is a commercial product and requires a paid license for possession or use. Syncfusion's licensed software, including this component, is subject to the terms and conditions of [Syncfusion's EULA](https://www.syncfusion.com/license/studio/34.1.29/syncfusion_essential_studio_eula.pdf?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples). You can purchase a license [here](https://www.syncfusion.com/sales/products?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples) or start a free 30-day trial [here](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples).
