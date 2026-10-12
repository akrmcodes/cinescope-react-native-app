export const SECTION_HORIZONTAL_PADDING = 16;

export const SECTION_TITLE_FONT_SIZE = 18;

export const TRENDING_LIST_HEIGHT = 220;

export const TRENDING_CARD_WIDTH = 130;

export const LIST_GAP = 8;

export const GRID_COLUMNS = 2;

export const GRID_ASPECT_RATIO = 0.65;

export const STAFF_PICK_POSTER_WIDTH = 60;

export const STAFF_PICK_POSTER_HEIGHT = 90;

export const STAFF_PICK_POSTER_RADIUS = 8;

export function popularCardWidth(screenWidth: number): number {
  return (
    (screenWidth - SECTION_HORIZONTAL_PADDING * 2 - LIST_GAP * (GRID_COLUMNS - 1)) /
    GRID_COLUMNS
  );
}
