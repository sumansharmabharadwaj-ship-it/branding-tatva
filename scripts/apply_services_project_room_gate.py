from __future__ import annotations

from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return text.replace(old, new, 1)


def update_component() -> None:
    path = Path("src/sections/Services/ProjectRoomPackage.tsx")
    text = path.read_text()

    text = replace_once(
        text,
        '      <div\n        role="tablist"\n        aria-label={`${pkg.name} project room`}',
        '      <div\n        data-project-room-tabs="true"\n        role="tablist"\n        aria-label={`${pkg.name} project room`}',
        "Project Room tablist marker",
    )
    text = replace_once(
        text,
        '      <div\n        id={`${pkg.slug}-room-panel`}\n        role="tabpanel"',
        '      <div\n        data-project-room-panel="true"\n        id={`${pkg.slug}-room-panel`}\n        role="tabpanel"',
        "Project Room panel marker",
    )
    text = replace_once(
        text,
        '                <ol className="relative mt-6 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-6 sm:gap-3">',
        '                <ol data-project-room-route="true" className="relative mt-6 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-6 sm:gap-3">',
        "Project Room route marker",
    )
    text = replace_once(
        text,
        '                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">',
        '                  <ul data-project-room-deliverables="true" className="mt-4 grid gap-2.5 sm:grid-cols-2">',
        "Project Room deliverables marker",
    )
    text = replace_once(
        text,
        '                  <div className="mt-4 flex flex-wrap gap-2">',
        '                  <div data-project-room-additions="true" className="mt-4 flex flex-wrap gap-2">',
        "Project Room additions marker",
    )
    text = replace_once(
        text,
        '            {tab === "investment" && (\n              <div className="grid gap-7 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-start md:gap-10">',
        '            {tab === "investment" && (\n              <div data-project-room-investment="true" className="grid gap-7 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-start md:gap-10">',
        "Project Room investment marker",
    )

    path.write_text(text)


def update_gate() -> None:
    path = Path("scripts/services_page_gate.cjs")
    text = path.read_text()

    old = '''  await waitForVisibleText(desire, "Full Brand System", `${label}: package recommendation`);
  await waitForVisibleText(desire, "Projects begin at", `${label}: package price framing`);
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-package-recommendation.png`);

  const compareButton = desire.getByRole("button", { name: "Compare all three side by side", exact: true });'''

    new = '''  await waitForVisibleText(desire, "Full Brand System", `${label}: package recommendation`);
  await waitForVisibleText(desire, "Projects begin at", `${label}: package price framing`);

  // Project Room: the recommendation is a workspace rather than a
  // pricing card. Four chapters expose the business situation, central
  // decision, project route, real deliverables, client/timeline policy,
  // localized investment, separate additions, proof, and quotation path
  // without stacking all of that information in one mobile column.
  const projectRoom = desire.locator('[data-project-room="true"]');
  await projectRoom.waitFor({ state: "visible", timeout: 8_000 });
  assert((await projectRoom.getAttribute("data-project-room-tab")) === "brief", `${label}: Project Room does not open on the brief`);
  const projectRoomTabs = projectRoom
    .getByRole("tablist", { name: "Full Brand System project room" })
    .getByRole("tab");
  await waitForCount(projectRoomTabs, 4, `${label}: Project Room chapters`);
  await assertTouchTargets(projectRoomTabs, 40, `${label}: Project Room chapters`);
  const projectRoomPanel = projectRoom.locator('[data-project-room-panel="true"]');
  assert((await visibleCount(projectRoomPanel)) === 1, `${label}: Project Room has more than one visible chapter panel`);
  await waitForVisibleText(projectRoomPanel, "For existing brands that feel unclear", `${label}: Project Room business situation`);
  await waitForVisibleText(projectRoomPanel, "Everything in Foundation, plus a full audit", `${label}: Project Room core decision`);

  const routeTab = projectRoom.getByRole("tab", { name: "The route", exact: true });
  await routeTab.click();
  assert((await routeTab.getAttribute("aria-selected")) === "true", `${label}: Project Room route chapter did not activate`);
  assert((await projectRoom.getAttribute("data-project-room-tab")) === "route", `${label}: Project Room route state is missing`);
  const projectRoute = projectRoom.locator('[data-project-room-route="true"]');
  for (const phase of ["Discover", "Define", "Design", "Develop", "Deliver", "Evolve"]) {
    await waitForVisibleText(projectRoute, phase, `${label}: Project Room phase ${phase}`);
  }
  await waitForVisibleText(projectRoomPanel, "Client input", `${label}: Project Room client input policy`);
  await waitForVisibleText(projectRoomPanel, "Timeline policy", `${label}: Project Room timeline policy`);

  const scopeTab = projectRoom.getByRole("tab", { name: "What arrives", exact: true });
  await scopeTab.click();
  assert((await scopeTab.getAttribute("aria-selected")) === "true", `${label}: Project Room scope chapter did not activate`);
  const roomDeliverables = projectRoom.locator('[data-project-room-deliverables="true"] > li');
  await waitForCount(roomDeliverables, 6, `${label}: Full Brand System deliverables`);
  const roomAdditions = projectRoom.locator('[data-project-room-additions="true"] > span');
  await waitForCount(roomAdditions, 6, `${label}: separately quoted additions`);
  await waitForVisibleText(projectRoomPanel, "Voice & messaging alignment across channels", `${label}: Project Room deliverable content`);
  await waitForVisibleText(projectRoomPanel, "Licensing", `${label}: Project Room addition content`);

  const investmentTab = projectRoom.getByRole("tab", { name: "Investment", exact: true });
  await investmentTab.click();
  assert((await investmentTab.getAttribute("aria-selected")) === "true", `${label}: Project Room investment chapter did not activate`);
  const investmentPanel = projectRoom.locator('[data-project-room-investment="true"]');
  await waitForVisibleText(investmentPanel, "$6,500", `${label}: Project Room localized investment`);
  await waitForVisibleText(investmentPanel, "Final scope and quotation follow the discovery conversation", `${label}: Project Room quotation policy`);
  assert((await investmentPanel.getByRole("link", { name: "Request a scoped quotation", exact: true }).count()) === 1, `${label}: Project Room quotation CTA is missing`);
  assert((await investmentPanel.getByRole("link", { name: "See the decision trail", exact: true }).count()) === 1, `${label}: Project Room verified proof path is missing`);
  await assertTouchTargets(investmentPanel.getByRole("link"), 40, `${label}: Project Room investment links`);

  const returnToBrief = projectRoom.getByRole("button", { name: "Return to the brief", exact: true });
  await assertTouchTargets(returnToBrief, 40, `${label}: Project Room next-chapter control`);
  await returnToBrief.click();
  assert((await projectRoom.getAttribute("data-project-room-tab")) === "brief", `${label}: Project Room cannot return to its brief`);

  if (viewport.width < 1024) {
    const projectRoomBox = await projectRoom.boundingBox();
    assert(
      projectRoomBox && projectRoomBox.height <= viewport.height - 30,
      `${label}: Project Room exceeds one mobile frame ${JSON.stringify(projectRoomBox)}`,
    );
  }

  await scrollTo(page, projectRoom, `${label}/project-room`);
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-package-recommendation.png`);

  const compareButton = desire.getByRole("button", { name: "Compare all three side by side", exact: true });'''

    text = replace_once(text, old, new, "Project Room package audit")
    text = replace_once(
        text,
        '    packageChoices: 3,\n    packageComparisonCards: 3,',
        '    packageChoices: 3,\n    projectRoomChapters: 4,\n    projectRoomWorkspace: true,\n    packageComparisonCards: 3,',
        "Project Room result fields",
    )
    path.write_text(text)


def validate() -> None:
    contracts = {
        Path("src/sections/Services/ProjectRoomPackage.tsx"): [
            'data-project-room-tabs="true"',
            'data-project-room-panel="true"',
            'data-project-room-route="true"',
            'data-project-room-deliverables="true"',
            'data-project-room-additions="true"',
            'data-project-room-investment="true"',
        ],
        Path("scripts/services_page_gate.cjs"): [
            "Project Room does not open on the brief",
            "Project Room exceeds one mobile frame",
            "projectRoomChapters: 4",
            "projectRoomWorkspace: true",
        ],
    }
    for path, needles in contracts.items():
        text = path.read_text()
        for needle in needles:
            if needle not in text:
                raise SystemExit(f"{path}: missing contract {needle!r}")


if __name__ == "__main__":
    update_component()
    update_gate()
    validate()
    print("Services Project Room browser contract applied.")
