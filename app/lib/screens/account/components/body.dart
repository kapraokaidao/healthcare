import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/authentication/authentication.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';

class Body extends StatelessWidget {
  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
        builder: (ctx, state) {
      if (state.user.patient.selfieImage != null) {
        return SingleChildScrollView(
            child: Column(children: [
          Container(
              margin: EdgeInsets.all(20),
              padding: EdgeInsets.all(20),
              child: Table(
                children: [
                  TableRow(children: [
                    Text('First name',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(state.user.firstname)
                  ]),
                  rowSpacer,
                  TableRow(children: [
                    Text('Last name',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(state.user.lastname)
                  ]),
                  rowSpacer,
                  TableRow(children: [
                    Text('Gender',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(state.user.patient.gender)
                  ]),
                  rowSpacer,
                  TableRow(children: [
                    Text('Birth Date',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(state.user.patient.birthDate)
                  ]),
                  rowSpacer,
                  TableRow(children: [
                    Text('Phone',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(state.user.phone)
                  ]),
                  rowSpacer,
                  TableRow(children: [
                    Text('Address',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(state.user.address)
                  ])
                ],
              ),
              width: double.infinity,
              decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                  color: Colors.white,
                  border: Border.all(
                    color: Colors.grey,
                    style: BorderStyle.solid,
                    width: 1,
                  ))),
          OutlineButton(
            onPressed: () {
              context
                  .read<AuthenticationBloc>()
                  .add(AuthenticationLogoutRequested());
              Navigator.push(context, AuthenticationPage.route(null));
            },
            child: Text('Logout'),
          )
        ]));
      } else {
        return Center(child: CircularProgressIndicator());
      }
    });
  }
}
