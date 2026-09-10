"""APScheduler-based ingestion scheduler.

Jobs are scheduled according to each source''s official release calendar,
not arbitrary polling. Jobs are idempotent and safe to rerun.
"""
from __future__ import annotations

import structlog
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger

logger = structlog.get_logger()


def create_scheduler() -> BlockingScheduler:
    """Create and configure the ingestion scheduler."""
    scheduler = BlockingScheduler(timezone="Asia/Kolkata")

    # Jobs are registered here. Actual adapters and DB connections
    # are injected via the job factory pattern.
    logger.info("scheduler.created")
    return scheduler


def register_jobs(scheduler: BlockingScheduler, job_factory: Any) -> None:
    """Register all ingestion jobs with their schedules."""
    from ingestion.source_registry import load_registry

    registry = load_registry()

    for source_key, source_config in registry.items():
        cron = source_config.get("schedule_cron")
        if not cron:
            continue
        try:
            trigger = CronTrigger.from_crontab(cron, timezone="Asia/Kolkata")
            job_fn = job_factory(source_key, source_config)
            scheduler.add_job(job_fn, trigger=trigger, id=source_key, replace_existing=True)
            logger.info("scheduler.job_registered", source=source_key, cron=cron)
        except Exception as exc:
            logger.error("scheduler.job_registration_failed", source=source_key, error=str(exc))


def run_scheduler() -> None:
    """Entry point for the scheduler process."""
    scheduler = create_scheduler()
    logger.info("scheduler.starting")
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        logger.info("scheduler.stopped")


from typing import Any
