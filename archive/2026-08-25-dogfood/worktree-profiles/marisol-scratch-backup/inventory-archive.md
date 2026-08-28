# Inventory archive

Retired items, same schema as `inventory.md`. **Never loaded at draft time.**
Read only by `/content-engine inventory` when checking whether a new item
duplicates an old one.

Two things land here: an item that has been used and is past its lock and that
the human chose to retire, and any item marked `clearance: do-not-publish`,
which retires immediately regardless of use. Unused items never retire on their
own.

## Items

