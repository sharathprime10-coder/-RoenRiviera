import re
from typing import Tuple

def check_input_safety(message: str) -> Tuple[bool, str]:
    """
    Checks the user input for obvious prompt injection or abuse attempts.
    Returns (True, "") if safe, (False, reason) if unsafe.
    """
    patterns = [
        r"ignore previous instructions",
        r"disregard your rules",
        r"system prompt",
        r"you are now (?!a student|interested)", 
    ]
    for pattern in patterns:
        if re.search(pattern, message, re.IGNORECASE):
            return False, "Input flagged by safety guardrails."
    return True, ""
