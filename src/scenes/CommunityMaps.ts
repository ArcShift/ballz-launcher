import { Scene } from 'phaser';
import { GW, GH } from '../main';
import { playSound } from './Preloader';
import { getMaps, OnlineMap, isRealSupabase } from '../services/supabase';
import { getCrazyUser, showCrazyAuthPrompt } from '../services/crazygames';

const ITEMS_PER_PAGE = 4;

export class CommunityMaps extends Scene {
    private maps: OnlineMap[] = [];
    private currentPage: number = 0;
    private isLoading: boolean = false;

    // UI elements
    private listContainer: Phaser.GameObjects.Container;
    private statusText: Phaser.GameObjects.Text;
    private pageText: Phaser.GameObjects.Text;
    private prevBtn: Phaser.GameObjects.Text;
    private nextBtn: Phaser.GameObjects.Text;
    private authText: Phaser.GameObjects.Text;
    private authBtn: Phaser.GameObjects.Text;

    constructor() {
        super('CommunityMaps');
    }

    create() {
        // Background
        this.add.image(GW / 2, GH / 2, 'background').setDisplaySize(GW, GH);

        // Header Title
        this.add.text(GW / 2, 50, 'COMMUNITY STAGES', {
            fontFamily: 'Arial Black',
            fontSize: '36px',
            color: '#00ffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Database status indicator
        const isOnline = isRealSupabase();
        const statusLabel = isOnline ? '● SUPABASE ONLINE' : '● MOCK OFFLINE DATABASE';
        const statusColor = isOnline ? '#00ff66' : '#ffaa00';
        this.statusText = this.add.text(GW / 2, 95, statusLabel, {
            fontFamily: 'Arial Black',
            fontSize: '12px',
            color: statusColor
        }).setOrigin(0.5);

        if (!isOnline) {
            this.add.text(GW / 2, 115, 'Configure VITE_SUPABASE_URL & KEY in .env to enable cloud sharing.', {
                fontFamily: 'Arial',
                fontSize: '11px',
                color: '#aaaaaa'
            }).setOrigin(0.5);
        }

        // Back Button
        const backBtn = this.add.text(50, 45, '◀ BACK', {
            fontFamily: 'Arial Black',
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => backBtn.setColor('#ffcc00'));
        backBtn.on('pointerout', () => backBtn.setColor('#ffffff'));
        backBtn.on('pointerdown', () => {
            playSound(this, 'click');
            this.scene.start('MainMenu');
        });

        // Refresh Button
        const refreshBtn = this.add.text(GW - 90, 45, '🔄 REFRESH', {
            fontFamily: 'Arial Black',
            fontSize: '16px',
            color: '#00ffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        refreshBtn.on('pointerover', () => refreshBtn.setColor('#ffffff'));
        refreshBtn.on('pointerout', () => refreshBtn.setColor('#00ffff'));
        refreshBtn.on('pointerdown', () => {
            playSound(this, 'click');
            this.fetchMaps();
        });

        // Setup CrazyGames Auth UI
        this.setupAuthUI();

        // Main List Container
        this.listContainer = this.add.container(0, 0);

        // Page controls
        this.createPageControls();

        // Fetch first batch of maps
        this.fetchMaps();
    }

    private async setupAuthUI() {
        this.authText = this.add.text(GW - 200, 95, 'Guest', {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(1, 0.5);

        this.authBtn = this.add.text(GW - 80, 95, '[ LOGIN ]', {
            fontFamily: 'Arial Black',
            fontSize: '14px',
            color: '#00ff66'
        }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });

        this.authBtn.on('pointerover', () => this.authBtn.setColor('#ffffff'));
        this.authBtn.on('pointerout', () => this.authBtn.setColor('#00ff66'));
        this.authBtn.on('pointerdown', async () => {
            playSound(this, 'click');
            this.authBtn.setText('Logging in...');
            const user = await showCrazyAuthPrompt();
            this.updateUserAuthStatus(user);
        });

        // Auto check username on load
        const activeUser = await getCrazyUser();
        this.updateUserAuthStatus(activeUser);
    }

    private updateUserAuthStatus(user: any) {
        if (user) {
            this.authText.setText(`Logged in as: ${user.username}`);
            this.authBtn.setVisible(false);
        } else {
            this.authText.setText('Guest Mode');
            this.authBtn.setText('[ LOGIN ]').setVisible(true);
        }
    }

    private async fetchMaps() {
        if (this.isLoading) return;
        this.isLoading = true;

        // Clear existing
        this.listContainer.removeAll(true);

        const loadingMsg = this.add.text(GW / 2, GH / 2, 'Loading levels from database...', {
            fontFamily: 'Arial Black',
            fontSize: '20px',
            color: '#00ffff'
        }).setOrigin(0.5);
        this.listContainer.add(loadingMsg);

        const { data, error } = await getMaps();

        loadingMsg.destroy();
        this.isLoading = false;

        if (error) {
            console.error('Fetch maps error:', error);
            const errorMsg = this.add.text(GW / 2, GH / 2, 'Failed to connect to Database.', {
                fontFamily: 'Arial Black',
                fontSize: '20px',
                color: '#ff4444'
            }).setOrigin(0.5);
            this.listContainer.add(errorMsg);
            return;
        }

        this.maps = data || [];
        this.currentPage = 0;
        this.renderCurrentPage();
    }

    private renderCurrentPage() {
        this.listContainer.removeAll(true);

        if (this.maps.length === 0) {
            const noMapsText = this.add.text(GW / 2, GH / 2, 'No community levels created yet.\nBe the first to publish one!', {
                fontFamily: 'Arial Black',
                fontSize: '20px',
                color: '#aaaaaa',
                align: 'center'
            }).setOrigin(0.5);
            this.listContainer.add(noMapsText);
            this.pageText.setText('Page 0 of 0');
            this.prevBtn.setVisible(false);
            this.nextBtn.setVisible(false);
            return;
        }

        const startIndex = this.currentPage * ITEMS_PER_PAGE;
        const pageItems = this.maps.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        const startY = 160;
        const itemHeight = 110;
        const width = 800;

        pageItems.forEach((map, index) => {
            const y = startY + index * itemHeight;

            // Panel background (glassmorphism look)
            const bg = this.add.rectangle(GW / 2, y + 50, width, itemHeight - 10, 0x0a1c28, 0.75)
                .setStrokeStyle(2, 0x00ffff, 0.5)
                .setInteractive();
            this.listContainer.add(bg);

            // Left padding
            const leftX = GW / 2 - width / 2 + 25;

            // Title
            const title = this.add.text(leftX, y + 20, map.title, {
                fontFamily: 'Arial Black',
                fontSize: '20px',
                color: '#ffffff'
            });
            this.listContainer.add(title);

            // Author & Date
            const dateStr = new Date(map.created_at).toLocaleDateString();
            const subtitle = this.add.text(leftX, y + 48, `by ${map.author}  •  ${dateStr}`, {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#aaaaaa'
            });
            this.listContainer.add(subtitle);

            // Rating & comments metadata
            const avgRating = map.avg_rating || 0;
            const ratingText = avgRating > 0 ? `⭐ ${avgRating} (${map.total_ratings} votes)` : '⭐ Unrated';
            const commentsText = `💬 ${map.comments_count || 0} comments`;

            const meta = this.add.text(leftX, y + 72, `${ratingText}    ${commentsText}`, {
                fontFamily: 'Arial',
                fontSize: '13px',
                color: '#00ffff'
            });
            this.listContainer.add(meta);

            // Play Button
            const playBtnBg = this.add.rectangle(GW / 2 + width / 2 - 80, y + 50, 110, 46, 0x00ff66)
                .setInteractive({ useHandCursor: true });
            const playBtnText = this.add.text(GW / 2 + width / 2 - 80, y + 50, 'PLAY', {
                fontFamily: 'Arial Black',
                fontSize: '16px',
                color: '#000000'
            }).setOrigin(0.5);

            playBtnBg.on('pointerover', () => {
                playBtnBg.setFillStyle(0xffffff);
            });
            playBtnBg.on('pointerout', () => {
                playBtnBg.setFillStyle(0x00ff66);
            });
            playBtnBg.on('pointerdown', () => {
                playSound(this, 'launch');
                this.scene.start('Game', {
                    mode: 'Community',
                    levelData: map.level_data,
                    communityMapId: map.id,
                    communityMapTitle: map.title,
                    communityMapAuthor: map.author
                });
            });

            this.listContainer.add([playBtnBg, playBtnText]);
        });

        // Update pagination labels
        const totalPages = Math.ceil(this.maps.length / ITEMS_PER_PAGE);
        this.pageText.setText(`Page ${this.currentPage + 1} of ${totalPages}`);
        this.prevBtn.setVisible(this.currentPage > 0);
        this.nextBtn.setVisible(this.currentPage < totalPages - 1);
    }

    private createPageControls() {
        const bottomY = GH - 70;

        this.pageText = this.add.text(GW / 2, bottomY, 'Page 1 of 1', {
            fontFamily: 'Arial Black',
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.prevBtn = this.add.text(GW / 2 - 160, bottomY, '◀ PREV', {
            fontFamily: 'Arial Black',
            fontSize: '16px',
            color: '#00ffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.prevBtn.on('pointerover', () => this.prevBtn.setColor('#ffffff'));
        this.prevBtn.on('pointerout', () => this.prevBtn.setColor('#00ffff'));
        this.prevBtn.on('pointerdown', () => {
            if (this.currentPage > 0) {
                playSound(this, 'click');
                this.currentPage--;
                this.renderCurrentPage();
            }
        });

        this.nextBtn = this.add.text(GW / 2 + 160, bottomY, 'NEXT ▶', {
            fontFamily: 'Arial Black',
            fontSize: '16px',
            color: '#00ffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.nextBtn.on('pointerover', () => this.nextBtn.setColor('#ffffff'));
        this.nextBtn.on('pointerout', () => this.nextBtn.setColor('#00ffff'));
        this.nextBtn.on('pointerdown', () => {
            const totalPages = Math.ceil(this.maps.length / ITEMS_PER_PAGE);
            if (this.currentPage < totalPages - 1) {
                playSound(this, 'click');
                this.currentPage++;
                this.renderCurrentPage();
            }
        });
    }
}
