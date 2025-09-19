/**
 * Performance Monitor for Localization System
 * Tracks and reports performance metrics for optimization
 */

export class PerformanceMonitor {
    constructor() {
        this.metrics = {
            languageSwitchTime: [],
            loadTime: [],
            cacheHitRate: 0,
            memoryUsage: 0,
            totalRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0
        };
        
        this.timers = new Map();
        this.startTime = performance.now();
        this.cacheHits = 0;
        this.cacheMisses = 0;
    }

    /**
     * Start timing an operation
     * @param {string} operation - Name of the operation
     */
    startTimer(operation) {
        this.timers.set(operation, performance.now());
    }

    /**
     * End timing an operation and record the result
     * @param {string} operation - Name of the operation
     * @returns {number} Duration in milliseconds
     */
    endTimer(operation) {
        const startTime = this.timers.get(operation);
        if (!startTime) return 0;

        const duration = performance.now() - startTime;
        this.timers.delete(operation);

        // Record specific metrics
        if (operation === 'languageSwitch') {
            this.metrics.languageSwitchTime.push(duration);
            // Keep only last 10 measurements
            if (this.metrics.languageSwitchTime.length > 10) {
                this.metrics.languageSwitchTime.shift();
            }
        } else if (operation === 'loadLanguage') {
            this.metrics.loadTime.push(duration);
            if (this.metrics.loadTime.length > 10) {
                this.metrics.loadTime.shift();
            }
        }

        return duration;
    }

    /**
     * Record cache hit
     */
    recordCacheHit() {
        this.cacheHits++;
        this.updateCacheHitRate();
    }

    /**
     * Record cache miss
     */
    recordCacheMiss() {
        this.cacheMisses++;
        this.updateCacheHitRate();
    }

    /**
     * Update cache hit rate
     */
    updateCacheHitRate() {
        const total = this.cacheHits + this.cacheMisses;
        if (total > 0) {
            this.metrics.cacheHitRate = (this.cacheHits / total * 100).toFixed(2);
        }
    }

    /**
     * Record API request
     * @param {number} responseTime - Response time in milliseconds
     * @param {boolean} success - Whether request was successful
     */
    recordRequest(responseTime, success = true) {
        this.metrics.totalRequests++;
        if (!success) {
            this.metrics.failedRequests++;
        }

        // Update average response time
        const currentTotal = this.metrics.averageResponseTime * (this.metrics.totalRequests - 1);
        this.metrics.averageResponseTime = (currentTotal + responseTime) / this.metrics.totalRequests;
    }

    /**
     * Update memory usage
     */
    updateMemoryUsage() {
        if (performance.memory) {
            this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
        }
    }

    /**
     * Get performance metrics
     * @returns {Object} Current performance metrics
     */
    getMetrics() {
        this.updateMemoryUsage();
        
        return {
            languageSwitchTime: this.getAverageLanguageSwitchTime(),
            loadTime: this.getAverageLoadTime(),
            cacheHitRate: this.metrics.cacheHitRate,
            memoryUsage: this.metrics.memoryUsage,
            totalRequests: this.metrics.totalRequests,
            failedRequests: this.metrics.failedRequests,
            successRate: this.getSuccessRate(),
            averageResponseTime: this.metrics.averageResponseTime,
            uptime: this.getUptime(),
            performanceScore: this.calculatePerformanceScore()
        };
    }

    /**
     * Get average language switch time
     * @returns {number} Average time in milliseconds
     */
    getAverageLanguageSwitchTime() {
        if (this.metrics.languageSwitchTime.length === 0) return 0;
        const sum = this.metrics.languageSwitchTime.reduce((a, b) => a + b, 0);
        return sum / this.metrics.languageSwitchTime.length;
    }

    /**
     * Get average load time
     * @returns {number} Average time in milliseconds
     */
    getAverageLoadTime() {
        if (this.metrics.loadTime.length === 0) return 0;
        const sum = this.metrics.loadTime.reduce((a, b) => a + b, 0);
        return sum / this.metrics.loadTime.length;
    }

    /**
     * Get success rate
     * @returns {number} Success rate percentage
     */
    getSuccessRate() {
        if (this.metrics.totalRequests === 0) return 100;
        return ((this.metrics.totalRequests - this.metrics.failedRequests) / this.metrics.totalRequests * 100).toFixed(2);
    }

    /**
     * Get system uptime
     * @returns {number} Uptime in milliseconds
     */
    getUptime() {
        return performance.now() - this.startTime;
    }

    /**
     * Calculate overall performance score (0-100)
     * @returns {number} Performance score
     */
    calculatePerformanceScore() {
        let score = 100;

        // Deduct points for slow language switching
        const avgSwitchTime = this.getAverageLanguageSwitchTime();
        if (avgSwitchTime > 100) score -= 20;
        else if (avgSwitchTime > 50) score -= 10;

        // Deduct points for slow loading
        const avgLoadTime = this.getAverageLoadTime();
        if (avgLoadTime > 500) score -= 20;
        else if (avgLoadTime > 200) score -= 10;

        // Deduct points for low cache hit rate
        if (this.metrics.cacheHitRate < 50) score -= 20;
        else if (this.metrics.cacheHitRate < 80) score -= 10;

        // Deduct points for high failure rate
        const successRate = parseFloat(this.getSuccessRate());
        if (successRate < 90) score -= 20;
        else if (successRate < 95) score -= 10;

        return Math.max(0, score);
    }

    /**
     * Generate performance report
     * @returns {Object} Detailed performance report
     */
    generateReport() {
        const metrics = this.getMetrics();
        
        return {
            summary: {
                overallScore: metrics.performanceScore,
                status: this.getPerformanceStatus(metrics.performanceScore),
                recommendations: this.getRecommendations(metrics)
            },
            metrics: metrics,
            details: {
                languageSwitchTimes: this.metrics.languageSwitchTime,
                loadTimes: this.metrics.loadTime,
                cacheStats: {
                    hits: this.cacheHits,
                    misses: this.cacheMisses,
                    hitRate: this.metrics.cacheHitRate
                }
            }
        };
    }

    /**
     * Get performance status based on score
     * @param {number} score - Performance score
     * @returns {string} Status description
     */
    getPerformanceStatus(score) {
        if (score >= 90) return 'Excellent';
        if (score >= 80) return 'Good';
        if (score >= 70) return 'Fair';
        if (score >= 60) return 'Poor';
        return 'Critical';
    }

    /**
     * Get performance recommendations
     * @param {Object} metrics - Performance metrics
     * @returns {Array} Array of recommendations
     */
    getRecommendations(metrics) {
        const recommendations = [];

        if (metrics.languageSwitchTime > 100) {
            recommendations.push('Optimize language switching: Consider implementing preloading or caching strategies');
        }

        if (metrics.loadTime > 500) {
            recommendations.push('Optimize language loading: Consider implementing lazy loading or compression');
        }

        if (metrics.cacheHitRate < 80) {
            recommendations.push('Improve caching: Review cache invalidation strategy and increase cache size');
        }

        if (metrics.successRate < 95) {
            recommendations.push('Reduce failures: Investigate and fix common failure points');
        }

        if (metrics.memoryUsage > 50 * 1024 * 1024) { // 50MB
            recommendations.push('Optimize memory usage: Review memory allocation and cleanup strategies');
        }

        if (recommendations.length === 0) {
            recommendations.push('Performance is optimal. Continue monitoring for any degradation.');
        }

        return recommendations;
    }

    /**
     * Reset all metrics
     */
    reset() {
        this.metrics = {
            languageSwitchTime: [],
            loadTime: [],
            cacheHitRate: 0,
            memoryUsage: 0,
            totalRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0
        };
        this.timers.clear();
        this.startTime = performance.now();
        this.cacheHits = 0;
        this.cacheMisses = 0;
    }

    /**
     * Export metrics to JSON
     * @returns {string} JSON string of metrics
     */
    exportToJSON() {
        return JSON.stringify(this.generateReport(), null, 2);
    }

    /**
     * Log performance summary to console
     */
    logSummary() {
        const report = this.generateReport();
        console.group('🚀 Localization Performance Report');
        console.log(`Overall Score: ${report.summary.overallScore}/100 (${report.summary.status})`);
        console.log(`Language Switch: ${report.metrics.languageSwitchTime.toFixed(2)}ms avg`);
        console.log(`Load Time: ${report.metrics.loadTime.toFixed(2)}ms avg`);
        console.log(`Cache Hit Rate: ${report.metrics.cacheHitRate}%`);
        console.log(`Success Rate: ${report.metrics.successRate}%`);
        console.log(`Uptime: ${(report.metrics.uptime / 1000 / 60).toFixed(2)} minutes`);
        console.groupEnd();
    }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

export default PerformanceMonitor; 