export class TestRunner {
  private passed = 0;
  private failed: Error[] = [];

  run(name: string, fn: () => void): void {
    try {
      fn();
      this.passed++;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      this.failed.push(new Error(`${name}: ${e.message}`));
      console.error(`${name}:`, e.message);
    }
  }

  getPassed(): number {
    return this.passed;
  }

  getFailed(): number {
    return this.failed.length;
  }

  report(): { passed: number; failed: number; errors: Error[] } {
    return { passed: this.passed, failed: this.failed.length, errors: this.failed.slice() };
  }

  throwIfFailed(): void {
    if (this.failed.length) throw new Error(`${this.failed.length} teste(s) falharam`);
  }
}

export default TestRunner;
