function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
import { CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_LEVEL } from './constants.js';
import { isColliding } from './utils.js';
import Platform from './Platform.js';
import Enderman from './Endermen.js';
import MiningSpot from './MiningSpot.js';
import { RESOURCE_TYPES } from './constants.js';
import Blaze from './Blaze.js';
var World = /*#__PURE__*/ function() {
    "use strict";
    function World(assetLoader) {
        _class_call_check(this, World);
        this.assetLoader = assetLoader;
        this.levelWidth = 4000; // Extended level width for more platforming
        this.items = [];
        this.platforms = [];
        this.endermen = []; // Array to hold enderman enemies
        this.miningSpots = []; // Array to hold mining spots
        this.blazes = []; // Array to hold blaze enemies for stage 2
        this.cameraOffset = 0; // Add camera offset property
        this.generateLevel();
    }
    _create_class(World, [
        {
            // Method to set camera offset from Game class
            key: "setCameraOffset",
            value: function setCameraOffset(offset) {
                this.cameraOffset = offset;
            }
        },
        {
            key: "generateLevel",
            value: function generateLevel() {
                // Generate platforms
                this.generatePlatforms();
                // Generate resources
                this.generateResources();
                // Generate endermen
                this.generateEndermen();
                this.generateLavaPits();
            }
        },
        {
            key: "generatePlatforms",
            value: function generatePlatforms() {
                var _this = this;
                // Ground platform (immovable base)
                this.platforms.push(new Platform(0, GROUND_LEVEL + 30, this.levelWidth, 50, false, this.assetLoader));
                // Add floating platforms (some with quizzes)
                var platformPositions = [
                    // First stack (2 platforms)
                    {
                        x: 300,
                        y: 300,
                        hasQuiz: false
                    },
                    {
                        x: 300,
                        y: 180,
                        hasQuiz: true
                    },
                    // Second stack (2 platforms)
                    {
                        x: 750,
                        y: 280,
                        hasQuiz: false
                    },
                    {
                        x: 750,
                        y: 160,
                        hasQuiz: true
                    },
                    // Third stack (2 platforms)
                    {
                        x: 1200,
                        y: 320,
                        hasQuiz: false
                    },
                    {
                        x: 1200,
                        y: 200,
                        hasQuiz: true
                    },
                    // Fourth stack 
                    {
                        x: 1650,
                        y: 290,
                        hasQuiz: false
                    },
                    {
                        x: 1650,
                        y: 170,
                        hasQuiz: true
                    },
                    // Fifth stack
                    {
                        x: 2100,
                        y: 310,
                        hasQuiz: false
                    },
                    {
                        x: 2100,
                        y: 190,
                        hasQuiz: true
                    },
                    // Sixth stack  
                    {
                        x: 2550,
                        y: 300,
                        hasQuiz: false
                    },
                    {
                        x: 2550,
                        y: 180,
                        hasQuiz: true
                    },
                    // Seventh stack
                    {
                        x: 3000,
                        y: 320,
                        hasQuiz: false
                    },
                    {
                        x: 3000,
                        y: 200,
                        hasQuiz: true
                    }
                ];
                platformPositions.forEach(function(param) {
                    var x = param.x, y = param.y, hasQuiz = param.hasQuiz;
                    _this.platforms.push(new Platform(x, y, undefined, undefined, hasQuiz, _this.assetLoader));
                });
            }
        },
        {
            key: "generateResources",
            value: function generateResources() {
                // Add mining spots instead of resources
                this.generateMiningSpots();
            }
        },
        {
            key: "generateMiningSpots",
            value: function generateMiningSpots() {
                // Place mining spots on platforms
                this.platforms.forEach((platform, index) => {
                    // Skip the ground platform (index 0)
                    if (index === 0) return;

                    // Set all mining spots to have a "random" type
                    // The actual resource will be determined when mining is complete
                    let resourceType = 'random';

                    // Position mining spot near the platform
                    const miningSpot = new MiningSpot(
                        platform.x + platform.width / 2 - 20,
                        platform.y - 55,
                        resourceType
                    );
                    this.miningSpots.push(miningSpot);

                    // Add an enderman to guard this mining spot if it doesn't already have one
                    // Check if there's already an enderman guarding this platform
                    let hasGuard = false;
                    for (const enderman of this.endermen) {
                        if (enderman.platform === platform) {
                            hasGuard = true;
                            break;
                        }
                    }

                    // If no guard exists, add one
                    if (!hasGuard) {
                        const patrolStart = platform.x + 20;
                        const patrolEnd = platform.x + platform.width - 20;
                        this.endermen.push(new Enderman(
                            platform.x + platform.width / 2,
                            patrolStart,
                            patrolEnd,
                            platform
                        ));
                    }
                });
            }
        },
        {
            key: "generateEndermen",
            value: function generateEndermen() {
                var _this = this;
                // Add endermen at different locations along the level
                var endermenPositions = [
                    {
                        x: 400,
                        patrolStart: 300,
                        patrolEnd: 600
                    },
                    {
                        x: 900,
                        patrolStart: 800,
                        patrolEnd: 1100
                    },
                    {
                        x: 1500,
                        patrolStart: 1400,
                        patrolEnd: 1750
                    },
                    {
                        x: 2200,
                        patrolStart: 2050,
                        patrolEnd: 2350
                    },
                    {
                        x: 2800,
                        patrolStart: 2650,
                        patrolEnd: 3000
                    },
                    {
                        x: 3400,
                        patrolStart: 3250,
                        patrolEnd: 3550
                    }
                ];
                // Create enderman instances on ground level
                endermenPositions.forEach(function(param) {
                    var x = param.x, patrolStart = param.patrolStart, patrolEnd = param.patrolEnd;
                    _this.endermen.push(new Enderman(x, patrolStart, patrolEnd));
                });
            }
        },
        {
            key: "checkEndermanCollisions", 
            value: function checkEndermanCollisions(player) {
                for (const enderman of this.endermen) {
                    if (enderman.checkCollision(player)) {
                        return enderman;
                    }
                }
                return null;
            }
        },
        {
            key: "checkCollision",
            value: function checkCollision(player) {
                var playerBounds = player.getBounds();
                var playerX = player.x;
                var screenWidth = CANVAS_WIDTH;
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    // Only check items within the visible area plus a small buffer
                    for(var _iterator = this.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var item = _step.value;
                        // Skip items that are too far from the player (broad phase)
                        if (Math.abs(item.x - playerX) > screenWidth) continue;
                        // Detailed collision check only for nearby items (narrow phase)
                        if (isColliding(playerBounds, item)) {
                            return item;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return null;
            }
        },
        {
            key: "checkZombieCollisions",
            value: function checkZombieCollisions(player) {
                var playerBounds = player.getBounds();
                var playerX = player.x;
                var visibilityThreshold = CANVAS_WIDTH * 1.5; // Slightly larger than screen
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    // Only check zombies that are close to the player
                    for(var _iterator = this.zombies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var zombie = _step.value;
                        // Skip zombies that are too far away (broad phase)
                        if (Math.abs(zombie.x - playerX) > visibilityThreshold) continue;
                        // Only do precise collision checks for nearby zombies (narrow phase)
                        if (zombie.checkCollision(player)) {
                            return zombie;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return null;
            }
        },
        {
            // Check for platform collisions
            key: "checkPlatformCollisions",
            value: function checkPlatformCollisions(player) {
                var onPlatform = false;
                var quizTriggered = false;
                var playerX = player.x;
                var platformCheckDistance = CANVAS_WIDTH; // Only check platforms within this distance
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    // Skip platforms that are too far from the player
                    for(var _iterator = this.platforms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var platform = _step.value;
                        // Broad phase - distance-based culling
                        if (Math.abs(platform.x - playerX) > platformCheckDistance && Math.abs(platform.x + platform.width - playerX) > platformCheckDistance) {
                            continue;
                        }
                        // Narrow phase - detailed collision check
                        if (platform.isPlayerOn(player)) {
                            onPlatform = true;
                            player.y = platform.y - player.height; // Position player on top of platform
                            player.velocityY = 0;
                            player.isJumping = false;
                            // Check if this platform triggers a quiz
                            if (platform.update(player)) {
                                quizTriggered = true;
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return {
                    onPlatform: onPlatform,
                    quizTriggered: quizTriggered
                };
            }
        },
        {
            key: "removeItem",
            value: function removeItem(item) {
                this.items = this.items.filter(function(i) {
                    return i.id !== item.id;
                });
            }
        },
        {
            key: "addItem",
            value: function addItem(item) {
                // Generate a unique ID for the item if it doesn't have one
                if (!item.id) {
                    item.id = 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
                }
                this.items.push(item);
                return item;
            }
        },
        {
            key: "updateZombies",
            value: function updateZombies(deltaTime) {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    // Update all zombies
                    for(var _iterator = this.zombies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var zombie = _step.value;
                        zombie.update(deltaTime);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        },
        {
            key: "updateMiningSpots",
            value: function updateMiningSpots(deltaTime) {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    // Update all mining spots
                    for(var _iterator = this.miningSpots[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var miningSpot = _step.value;
                        miningSpot.update(deltaTime);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        },
        {
            key: "render",
            value: function render(ctx) {
                // Use the stored camera offset
                var cameraOffset = this.cameraOffset;
                // Draw trees in the background
                for(var i = 0; i < 15; i++){
                    this.drawTree(ctx, 100 + i * 300 - cameraOffset, 335);
                }
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    // Draw platforms
                    for(var _iterator = this.platforms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var platform = _step.value;
                        platform.render(ctx, cameraOffset);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                try {
                    // Draw mining spots
                    for(var _iterator1 = this.miningSpots[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                        var miningSpot = _step1.value;
                        miningSpot.render(ctx, cameraOffset, this.assetLoader);
                    }
                } catch (err) {
                    _didIteratorError1 = true;
                    _iteratorError1 = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                            _iterator1.return();
                        }
                    } finally{
                        if (_didIteratorError1) {
                            throw _iteratorError1;
                        }
                    }
                }
                var _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
                try {
                    // Draw enhanced lava pits
                    for(var _iterator2 = this.lavaPits[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
                        var pit = _step2.value;
                        var screenX = pit.x - cameraOffset;
                        if (screenX < -pit.width || screenX > CANVAS_WIDTH) continue;
                        // Save context for transformations
                        ctx.save();
                        ctx.translate(screenX, pit.y);
                        // Draw lava pit texture if available
                        var img = this.assetLoader.getAsset('lava pit');
                        if (img) {
                            ctx.drawImage(img, 0, 0, pit.width, pit.height);
                        } else {
                            // Simple fallback gradient
                            var gradient = ctx.createLinearGradient(0, 0, 0, pit.height);
                            gradient.addColorStop(0, '#FF5500');
                            gradient.addColorStop(1, '#8B0000');
                            ctx.fillStyle = gradient;
                            ctx.fillRect(0, 0, pit.width, pit.height);
                        }
                        ctx.restore();
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                            _iterator2.return();
                        }
                    } finally{
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
                var _iteratorNormalCompletion3 = true, _didIteratorError3 = false, _iteratorError3 = undefined;
                try {
                    // Draw mining spots with gold blocks
                    for(var _iterator3 = this.items[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true){
                        var item = _step3.value;
                        var screenX1 = item.x - cameraOffset;
                        // Only draw if visible on screen
                        if (screenX1 > -item.width && screenX1 < CANVAS_WIDTH) {
                            if (item.type === 'gold nugget') {
                                this.drawGoldNugget(ctx, screenX1, item.y);
                            } else if (item.type === 'blazerod') {
                                this.drawBlazeRod(ctx, screenX1, item.y);
                            } else if (item.type === 'enderpearl') {
                                // Draw enderpearl with floating animation
                                const floatOffset = Math.sin(Date.now() / 400) * 3;
                                ctx.save();
                                ctx.translate(0, floatOffset);
                                this.drawEnderpearl(ctx, screenX1, item.y);
                                ctx.restore();
                                
                                // Add particles for enderpearl
                                if (Math.random() < 0.1) {
                                    // Occasionally add a particle effect
                                    const particleSize = 2 + Math.random() * 2;
                                    const particleX = screenX1 + item.width/2 + (Math.random() - 0.5) * 10;
                                    const particleY = item.y + item.height/2 + (Math.random() - 0.5) * 10;
                                    
                                    ctx.fillStyle = '#55FFAA';
                                    ctx.globalAlpha = 0.7;
                                    ctx.beginPath();
                                    ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.globalAlpha = 1.0;
                                }
                            }
                            // Draw label if needed
                            if (item.type) {
                                ctx.fillStyle = 'white';
                                ctx.font = '12px Arial';
                                ctx.fillText(item.type, screenX1, item.y - 5);
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                            _iterator3.return();
                        }
                    } finally{
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
                var _iteratorNormalCompletion4 = true, _didIteratorError4 = false, _iteratorError4 = undefined;
                try {
                    // Render endermen
                    for(var _iterator4 = this.endermen[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true){
                        var enderman = _step4.value;
                        enderman.render(ctx, cameraOffset, this.assetLoader);
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                            _iterator4.return();
                        }
                    } finally{
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }
                var _iteratorNormalCompletion5 = true, _didIteratorError5 = false, _iteratorError5 = undefined;
                try {
                    // Render blazes
                    for(var _iterator5 = this.blazes[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true){
                        var blaze = _step5.value;
                        blaze.render(ctx, this.cameraOffset, this.assetLoader);
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                            _iterator5.return();
                        }
                    } finally{
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }
            }
        },
        {
            key: "drawTree",
            value: function drawTree(ctx, x, y) {
                var _this_assetLoader;
                var minecraftTexture = (_this_assetLoader = this.assetLoader) === null || _this_assetLoader === void 0 ? void 0 : _this_assetLoader.getAsset('minecraft');
                if (minecraftTexture) {
                    // Draw tree trunk using wood texture from minecraft.png
                    // The wood texture is typically in the bottom half of the image
                    ctx.fillStyle = '#8B4513'; // Base color
                    ctx.fillRect(x, y - 65, 20, 70);
                    // Draw tree leaves using green texture
                    ctx.fillStyle = '#006400'; // Base color
                    ctx.fillRect(x - 20, y - 115, 60, 50);
                    // Add some pixel-like detail to match Minecraft aesthetic
                    ctx.fillStyle = '#005400'; // Darker green for texture
                    for(var i = 0; i < 12; i++){
                        var leafX = x - 20 + Math.floor(Math.random() * 60);
                        var leafY = y - 115 + Math.floor(Math.random() * 50);
                        ctx.fillRect(leafX, leafY, 5, 5);
                    }
                } else {
                    // Fallback if texture isn't loaded
                    // Tree trunk
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(x, y - 65, 20, 70);
                    // Tree leaves
                    ctx.fillStyle = '#006400';
                    ctx.fillRect(x - 20, y - 115, 60, 50);
                }
            }
        },
        {
            key: "drawSticks",
            value: function drawSticks(ctx, x, y) {
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x, y, 35, 10);
                ctx.fillRect(x + 15, y + 10, 10, 20);
            }
        },
        {
            key: "drawStrings",
            value: function drawStrings(ctx, x, y) {
                ctx.strokeStyle = '#DDDDDD';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + 30, y + 35);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x + 10, y);
                ctx.lineTo(x + 20, y + 35);
                ctx.stroke();
            }
        },
        {
            key: "drawFlint",
            value: function drawFlint(ctx, x, y) {
                ctx.fillStyle = '#777777';
                ctx.beginPath();
                ctx.moveTo(x, y + 15);
                ctx.lineTo(x + 15, y);
                ctx.lineTo(x + 25, y + 10);
                ctx.lineTo(x + 20, y + 25);
                ctx.fill();
            }
        },
        {
            key: "drawFeather",
            value: function drawFeather(ctx, x, y) {
                ctx.fillStyle = '#F5F5F5';
                ctx.beginPath();
                ctx.moveTo(x, y + 40);
                ctx.lineTo(x + 10, y);
                ctx.lineTo(x + 20, y + 40);
                ctx.fill();
                // Feather stem
                ctx.fillStyle = '#DDD';
                ctx.fillRect(x + 9, y + 5, 2, 30);
            }
        },
        {
            key: "drawGoldNugget",
            value: function drawGoldNugget(ctx, x, y) {
                const nuggetSize = 20;
                const goldTexture = this.assetLoader.getAsset('gold nugget');
                
                if (goldTexture) {
                    ctx.drawImage(goldTexture, x, y, nuggetSize, nuggetSize);
                    
                    // Add a subtle glow effect
                    ctx.save();
                    ctx.globalAlpha = 0.3;
                    ctx.shadowColor = '#FFD700';
                    ctx.shadowBlur = 10;
                    ctx.drawImage(goldTexture, x, y, nuggetSize, nuggetSize);
                    ctx.restore();
                } else {
                    // Fallback if texture isn't loaded
                    ctx.fillStyle = '#FFD700';
                    ctx.fillRect(x, y, nuggetSize, nuggetSize);
                    
                    // Add shading for 3D effect
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.fillRect(x, y, nuggetSize, 5);
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                    ctx.fillRect(x, y + 5, 5, nuggetSize - 5);
                }
            }
        },
        {
            key: "drawEnderpearl",
            value: function drawEnderpearl(ctx, x, y) {
                const pearlSize = 20;
                const enderpearlTexture = this.assetLoader.getAsset('enderpearl');
                
                if (enderpearlTexture) {
                    ctx.drawImage(enderpearlTexture, x, y, pearlSize, pearlSize);
                    
                    // Add a subtle glow effect for the enderpearl
                    ctx.save();
                    ctx.globalAlpha = 0.3;
                    ctx.shadowColor = '#55FFAA';
                    ctx.shadowBlur = 10;
                    ctx.drawImage(enderpearlTexture, x, y, pearlSize, pearlSize);
                    ctx.restore();
                } else {
                    // Fallback if texture isn't loaded
                    ctx.fillStyle = '#1D8B77';
                    ctx.beginPath();
                    ctx.arc(x + pearlSize/2, y + pearlSize/2, pearlSize/2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Add inner glow
                    ctx.fillStyle = '#55FFAA';
                    ctx.beginPath();
                    ctx.arc(x + pearlSize/2, y + pearlSize/2, pearlSize/4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        },
        {
            key: "generateLavaPits",
            value: function generateLavaPits() {
                this.lavaPits = [];
                var pitCount = 8; // Fewer but more prominent pits
                var minGap = 300;
                var maxGap = 500;
                var currentX = 400;
                // Generate more natural looking lava rivers
                for(var i = 0; i < pitCount; i++){
                    var width = 100 + Math.random() * 100; // Wider pits
                    var height = 40; // Deeper
                    var gap = minGap + Math.random() * (maxGap - minGap);
                    var yVariation = 5 + Math.random() * 10; // Vary height slightly
                    this.lavaPits.push({
                        x: currentX + gap,
                        y: GROUND_LEVEL + 30,
                        width: width,
                        height: height + 30 // Deeper pit
                    });
                    currentX += gap + width;
                }
                // Add one large lava lake at the end
                this.lavaPits.push({
                    x: currentX + 200,
                    y: GROUND_LEVEL + 30,
                    width: 300,
                    height: 90 // Deeper pit
                });
            }
        },
        {
            key: "_drawLavaSmoke",
            value: function _drawLavaSmoke(ctx, x, y, width) {
                ctx.save();
                ctx.translate(x, y + 5);
                var time = Date.now() * 0.0015;
                var gradientStops = [
                    {
                        color: '#FF4500',
                        pos: 0
                    },
                    {
                        color: '#FF8C00',
                        pos: 0.3
                    },
                    {
                        color: '#FF0000',
                        pos: 0.6
                    },
                    {
                        color: '#8B0000',
                        pos: 1
                    } // Dark red
                ];
                var particleCount = 24;
                ctx.globalCompositeOperation = 'lighter';
                for(var i = 0; i < particleCount; i++){
                    var seed = i * 0.2 + time;
                    var noise = Math.sin(seed) * 0.5 + 0.5;
                    // Position with organic movement
                    var offsetX = noise * width % width;
                    var offsetY = -15 - time * (35 + noise * 15) % 80;
                    // Size with pulsing effect
                    var sizePulse = 0.8 + Math.sin(time * 2 + i) * 0.4;
                    var size = 1.5 + noise * 2.5 * sizePulse;
                    // Color with gradient
                    var colorPos = Math.min(1, Math.max(0, noise));
                    var color = this._getGradientColor(gradientStops, colorPos);
                    var alpha = 0.6 + Math.sin(time * 4 + i) * 0.2;
                    ctx.fillStyle = "rgba(".concat(color.r, ", ").concat(color.g, ", ").concat(color.b, ", ").concat(alpha, ")");
                    // Draw with distortion
                    ctx.beginPath();
                    var distortion = 0.5 + Math.sin(time * 3 + i * 0.5) * 0.5;
                    var sides = 5 + Math.floor(distortion * 4);
                    var radius = size * (0.8 + distortion * 0.4);
                    for(var a = 0; a < Math.PI * 2; a += Math.PI * 2 / sides){
                        ctx.lineTo(offsetX + Math.cos(a) * radius, offsetY + Math.sin(a) * radius * (1 + distortion * 0.3));
                    }
                    ctx.closePath();
                    ctx.fill();
                }
                ctx.globalCompositeOperation = 'source-over';
                ctx.restore();
            }
        },
        {
            key: "_getGradientColor",
            value: function _getGradientColor(stops, position) {
                // Find the two stops surrounding the position
                var start = stops[0];
                var end = stops[stops.length - 1];
                for(var i = 0; i < stops.length - 1; i++){
                    if (position >= stops[i].pos && position <= stops[i + 1].pos) {
                        start = stops[i];
                        end = stops[i + 1];
                        break;
                    }
                }
                // Calculate the color between the two stops
                var range = end.pos - start.pos;
                var percent = (position - start.pos) / range;
                // Parse hex colors
                var col1 = this._hexToRgb(start.color);
                var col2 = this._hexToRgb(end.color);
                return {
                    r: Math.round(col1.r + (col2.r - col1.r) * percent),
                    g: Math.round(col1.g + (col2.g - col1.g) * percent),
                    b: Math.round(col1.b + (col2.b - col1.b) * percent)
                };
            }
        },
        {
            key: "_hexToRgb",
            value: function _hexToRgb(hex) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : {
                    r: 0,
                    g: 0,
                    b: 0
                };
            }
        },
        {
            key: "_updateEmbers",
            value: function _updateEmbers() {
                if (!this._embers) {
                    this._embers = [];
                    for(var i = 0; i < 30; i++){
                        this._createRandomEmber();
                    }
                }
                for(var i1 = this._embers.length - 1; i1 >= 0; i1--){
                    var ember = this._embers[i1];
                    ember.x += ember.speedX;
                    ember.y += ember.speedY;
                    ember.life--;
                    if (ember.life <= 0) {
                        this._embers.splice(i1, 1);
                        this._createRandomEmber();
                    }
                }
            }
        },
        {
            key: "_createRandomEmber",
            value: function _createRandomEmber() {
                this._embers.push({
                    x: Math.random() * this.levelWidth,
                    y: GROUND_LEVEL - 30 - Math.random() * 100,
                    size: 1 + Math.random() * 2,
                    speedX: -0.5 + Math.random(),
                    speedY: -0.2 - Math.random() * 0.5,
                    life: 200 + Math.random() * 200
                });
            }
        },
        {
            key: "_renderEmbers",
            value: function _renderEmbers(ctx) {
                if (!ctx || !this._embers) return;
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this._embers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var ember = _step.value;
                        var screenX = ember.x - this.cameraOffset;
                        if (screenX < -ember.size * 2 || screenX > ctx.canvas.width) continue;
                        var gradient = ctx.createRadialGradient(screenX, ember.y, 0, screenX, ember.y, ember.size * 2);
                        gradient.addColorStop(0, 'rgba(255, 100, 30, 0.8)');
                        gradient.addColorStop(1, 'transparent');
                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.arc(screenX, ember.y, ember.size * 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                ctx.restore();
            }
        },
        {
            key: "checkLavaPitCollision",
            value: function checkLavaPitCollision(player) {
                // Player's feet position
                const playerX = player.x;
                const playerY = player.y + player.height;
                const playerWidth = player.width;
                
                // Check collision with any lava pit
                for (const pit of this.lavaPits) {
                    // Check if player's feet overlap with the lava pit
                    if (
                        playerX + playerWidth * 0.1 < pit.x + pit.width &&
                        playerX + playerWidth * 0.9 > pit.x &&
                        playerY >= pit.y &&
                        playerY <= pit.y + 15 // Only check the top portion of the lava
                    ) {
                        return true;
                    }
                }
                
                return false;
            }
        },
        {
            key: "updateEndermen",
            value: function updateEndermen(deltaTime) {
                // Set game reference for accessing resources
                if (this.game) {
                    // Update all endermen
                    for (let i = 0; i < this.endermen.length; i++) {
                        const enderman = this.endermen[i];
                        enderman.update(deltaTime);
                        
                        // Update speed based on collected gold nuggets
                        if (this.game.resources && this.game.resources.goldNuggets !== undefined) {
                            enderman.updateSpeed(this.game.resources.goldNuggets);
                        }
                    }
                }
            }
        },
        {
            key: "updateBlazes",
            value: function updateBlazes(deltaTime, player) {
                for(let i = 0; i < this.blazes.length; i++) {
                    this.blazes[i].update(deltaTime, player);
                }
            }
        },
        {
            key: "checkBlazeCollisions",
            value: function checkBlazeCollisions(player) {
                for (const blaze of this.blazes) {
                    if (blaze.checkCollision(player)) {
                        return blaze;
                    }
                }
                return null;
            }
        },
        {
            key: "drawBlazeRod",
            value: function drawBlazeRod(ctx, x, y) {
                const rodSize = 40;
                // Debug statement to track assets
                const blazeRodTexture = this.assetLoader.getAsset('blazerod');
                
                if (blazeRodTexture) {
                    ctx.drawImage(blazeRodTexture, x, y, rodSize, rodSize);
                    
                    // Add a subtle glow effect
                    ctx.save();
                    ctx.globalAlpha = 0.3;
                    ctx.shadowColor = '#FFD700';
                    ctx.shadowBlur = 10;
                    ctx.drawImage(blazeRodTexture, x, y, rodSize, rodSize);
                    ctx.restore();
                } else {
                    // Fallback if texture isn't loaded
                    ctx.save();
                    
                    // Draw glowing rod
                    const glowGradient = ctx.createRadialGradient(
                        x + rodSize/2, y + rodSize/2, 0,
                        x + rodSize/2, y + rodSize/2, rodSize
                    );
                    
                    glowGradient.addColorStop(0, 'rgba(255, 200, 0, 0.7)');
                    glowGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
                    
                    ctx.fillStyle = glowGradient;
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.beginPath();
                    ctx.arc(x + rodSize/2, y + rodSize/2, rodSize, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Draw rod center
                    ctx.fillStyle = '#ffaa00';
                    ctx.beginPath();
                    ctx.rect(x + 3, y + rodSize/2 - 2, 14, 4);
                    ctx.fill();
                    
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.restore();
                }
                
                // Add floating particles effect
                if (Math.random() < 0.1) {
                    ctx.save();
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.fillStyle = 'rgba(255, 200, 0, 0.3)';
                    ctx.beginPath();
                    ctx.arc(
                        x + rodSize/2 + (Math.random() - 0.5) * 10, 
                        y + rodSize/2 + (Math.random() - 0.5) * 10, 
                        3 + Math.random() * 2, 
                        0, 
                        Math.PI * 2
                    );
                    ctx.fill();
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.restore();
                }
            }
        },
        {
            key: "drawItem",
            value: function drawItem(ctx, item) {
                const { type, x, y } = item;
                
                switch (type) {
                    case 'sticks':
                        this.drawSticks(ctx, x, y);
                        break;
                    case 'strings':
                        this.drawStrings(ctx, x, y);
                        break;
                    case 'flint':
                        this.drawFlint(ctx, x, y);
                        break;
                    case 'feather':
                        this.drawFeather(ctx, x, y);
                        break;
                    case 'gold nugget':
                        this.drawGoldNugget(ctx, x, y);
                        break;
                    case 'enderpearl':
                        this.drawEnderpearl(ctx, x, y);
                        break;
                    case 'blazerod':
                        this.drawBlazeRod(ctx, x, y);
                        break;
                    default:
                        // Default item drawing
                        ctx.fillStyle = '#ff0000';
                        ctx.fillRect(x - this.cameraOffset, y, 10, 10);
                        break;
                }
            }
        }
    ]);
    return World;
}();
export { World as default };
