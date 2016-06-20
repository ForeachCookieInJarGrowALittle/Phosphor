import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router-deprecated';

import { Noun } from './util/noun';
import { NounService } from './services/noun.service';
import { VerbComponent } from './verb.component'

@Component({
  selector: 'noun-blade',
  templateUrl: 'app/html/noun.component.html',
  styleUrls: ['app/css/noun.component.css']
})
export class NounComponent implements OnInit {

  constructor(
    private router: Router,
    private nounService: NounService) { }

  nouns: Noun[];
  modules: any;

  getNouns() {
      this.nounService.getNouns().then(nouns => this.nouns = nouns);
  }

  getModules() {
      this.nounService.getModules().then(modules => this.modules = modules);
  }

  getNounsByModule() {
    
  }

  ngOnInit() {
      this.getNouns();
      this.getModules();
  }

  search() {
    //This is a bit hacky as we need casting.
    var criteria = (<HTMLInputElement>document.getElementById("noun-search")).value;
    this.nounService.search(criteria).then(nouns => this.nouns = nouns);
  }

  setSelected(selectedNoun) {
    this.nounService.setSelected(selectedNoun);
  }

  selectModule(selectedModule) {
      this.nouns = selectedModule.nouns;
  }

}
