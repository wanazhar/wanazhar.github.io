export class QuestSystem {
  constructor(quests, achievements, saveSystem, landmarks) {
    this.quests = quests;
    this.achievements = achievements;
    this.saveSystem = saveSystem;
    this.landmarks = landmarks;
    this.completedAchievements = new Set();
  }

  get visitedLandmarks() {
    const visited = new Set(this.saveSystem.data.visited);
    return this.landmarks.filter((landmark) => visited.has(landmark.name));
  }

  progressFor(quest) {
    const visited = this.visitedLandmarks;
    if (quest.type === 'visitCount') return Math.min(visited.length, quest.target);
    if (quest.type === 'trainRides') return Math.min(this.saveSystem.data.trainRides, quest.target);
    if (quest.type === 'photos') return Math.min(this.saveSystem.data.photoCaptures, quest.target);
    if (quest.type === 'weather') return this.saveSystem.data.weatherModes.some((mode) => quest.modes.includes(mode)) ? 1 : 0;
    if (quest.type === 'districtVisits') return Math.min(visited.filter((landmark) => landmark.district === quest.district).length, quest.target);
    if (quest.type === 'tagVisits') {
      const count = visited.filter((landmark) => landmark.tags?.some((tag) => quest.tags.includes(tag)) || quest.tags.includes(landmark.category)).length;
      return Math.min(count, quest.target);
    }
    return 0;
  }

  evaluate() {
    const newlyCompleted = [];
    for (const quest of this.quests) {
      if (this.saveSystem.data.completedQuests.includes(quest.id)) continue;
      if (this.progressFor(quest) >= quest.target && this.saveSystem.completeQuest(quest.id)) newlyCompleted.push(quest);
    }
    for (const achievement of this.achievements) {
      if (achievement.id === 'kl-completist' && this.saveSystem.data.visited.length >= 20) this.completedAchievements.add(achievement.id);
      if (achievement.id === 'route-finisher' && this.saveSystem.data.completedRoutes.length > 0) this.completedAchievements.add(achievement.id);
      if (achievement.id === 'night-photographer' && this.saveSystem.data.nightPhoto) this.completedAchievements.add(achievement.id);
    }
    return newlyCompleted;
  }

  summaries() {
    return this.quests.map((quest) => ({
      ...quest,
      progress: this.progressFor(quest),
      complete: this.saveSystem.data.completedQuests.includes(quest.id)
    }));
  }
}
