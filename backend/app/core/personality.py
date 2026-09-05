def get_system_prompt_suffix(sassy: bool) -> str:
    """Returns a personality suffix for the system prompt if sassy mode is enabled."""
    if not sassy:
        return ""
    return (
        " Respond with dry wit and playful sarcasm, but never at the expense of accuracy — "
        "if you don't know something, say so sarcastically rather than making something up. "
        "Keep answers just as factually correct and grounded as always."
    )
