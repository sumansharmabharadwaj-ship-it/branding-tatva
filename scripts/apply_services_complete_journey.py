from __future__ import annotations

import runpy
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
GATE = ROOT / "scripts/services_page_gate.cjs"


def load_module(path: str, name: str) -> dict[str, Any]:
    return runpy.run_path(str(ROOT / path), run_name=name)


def run_script(path: str) -> None:
    runpy.run_path(str(ROOT / path), run_name="__main__")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return text.replace(old, new, 1)


def apply_faq_after_health(faq: dict[str, Any]) -> None:
    # The standalone FAQ transformer expects the original health-to-audit
    # result boundary. Temporarily collapse the Health Check fields, let the
    # existing focused transformer add the FAQ contract, then restore both
    # sets in the final machine-readable result.
    text = GATE.read_text()
    health_fields = (
        "    healthQuestions: 4,\n"
        "    healthOutcomeBands: 3,\n"
        "    compactHealthInstrument: true,\n"
        "    healthResultVerified: true,\n"
        "    publicAuditChecks: 5,"
    )
    original_boundary = "    healthQuestions: 4,\n    publicAuditChecks: 5,"
    text = replace_once(text, health_fields, original_boundary, "FAQ health boundary preparation")
    GATE.write_text(text)

    faq["update_gate"]()

    text = GATE.read_text()
    faq_boundary = "    healthQuestions: 4,\n    faqQuestions: 9,"
    combined_boundary = (
        "    healthQuestions: 4,\n"
        "    healthOutcomeBands: 3,\n"
        "    compactHealthInstrument: true,\n"
        "    healthResultVerified: true,\n"
        "    faqQuestions: 9,"
    )
    text = replace_once(text, faq_boundary, combined_boundary, "FAQ and Health Check result merge")
    GATE.write_text(text)


def validate_complete_journey() -> None:
    contracts = {
        ROOT / "src/sections/Services/ProjectRoomPackage.tsx": [
            'data-project-room="true"',
            'data-project-room-tabs="true"',
            'data-project-room-investment="true"',
        ],
        ROOT / "src/sections/Services/PerceptionLadder.tsx": [
            'label: "Unknown"',
            'label: "Noticed"',
            'label: "Recognized"',
            'label: "Remembered"',
            'label: "Preferred"',
            "not a direct measure of brand recall",
        ],
        ROOT / "src/sections/Services/HealthCheckMobileInstrument.tsx": [
            'data-health-mobile-instrument="true"',
            'data-health-result="true"',
            "Two answers reveal a direction",
        ],
        ROOT / "src/sections/Services/ServicesFAQ.tsx": [
            'data-services-faq-desktop="true"',
            'data-services-faq-mobile="true"',
            'data-faq-direct-answer="true"',
        ],
        ROOT / "src/sections/Services/StrategyRoomCTA.tsx": [
            'data-strategy-call-preview="true"',
            'data-strategy-brief="true"',
            'data-strategy-email-alternative="true"',
        ],
        ROOT / "src/app/services/page.tsx": [
            'id="questions"',
            "<ServicesFAQ />",
            '"@type": "FAQPage"',
            'href: "#questions"',
        ],
        GATE: [
            "projectRoomWorkspace: true",
            "perceptionRungs: 5",
            "compactHealthInstrument: true",
            "faqQuestions: 9",
            "strategyCallPreviewPoints: 4",
        ],
    }

    for path, needles in contracts.items():
        text = path.read_text()
        for needle in needles:
            if needle not in text:
                raise SystemExit(f"{path}: missing complete-journey contract {needle!r}")


if __name__ == "__main__":
    # Shared build blocker first. The script is intentionally source-only and
    # leaves every Work interaction unchanged while making the model capture
    # safe inside callbacks.
    run_script("scripts/fix_work_mobile_model_narrowing.py")

    health = load_module("scripts/apply_services_mobile_health_check_v2.py", "services_health_module")
    project_room = load_module("scripts/apply_services_project_room_gate.py", "services_project_room_module")
    faq = load_module("scripts/apply_services_practical_faq.py", "services_faq_module")

    # Source and page composition.
    health["update_health_check"]()
    health["update_services_page"]()
    project_room["update_component"]()
    run_script("scripts/fix_project_room_route_semantics.py")
    faq["update_services_page"]()

    # One browser contract, assembled in non-overlapping commercial order.
    project_room["update_gate"]()
    run_script("scripts/apply_services_recognition_ladder_gate.py")
    health["update_services_gate"]()
    apply_faq_after_health(faq)
    run_script("scripts/apply_services_strategy_room_gate.py")

    # Focused validations plus the cross-feature boundary.
    project_room["validate"]()
    health["validate"]()
    faq["validate"]()
    validate_complete_journey()

    print("Complete Services decision journey applied on the current cinematic base.")
