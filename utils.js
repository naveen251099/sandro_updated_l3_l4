export function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width + 10 && rect1.x + rect1.width + 10 > rect2.x && rect1.y < rect2.y + rect2.height + 10 && rect1.y + rect1.height + 10 > rect2.y;
}
